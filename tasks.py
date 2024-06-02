import atexit
import json
import logging
import os
import shutil
import subprocess as sp
from concurrent.futures import ThreadPoolExecutor

# noinspection PyUnresolvedReferences
from invoke import task

ROOT_DIR = os.path.dirname(__file__)
SERVER_DIR = os.path.join(ROOT_DIR, 'server')
FRONTEND_DIR = os.path.join(ROOT_DIR, 'frontend')

DOCKER_MONGO_NAME = 'acc487-mongo'
DEV_DB_NAME = 'acc487'

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s\t%(message)s')


@task
def build_frontend(c, production=False):
    with c.cd(FRONTEND_DIR):
        c.run('pnpm install', pty=True)
        c.run('pnpm run build', env={
            'NODE_ENV': 'production' if production else 'development',
            **os.environ,
        }, pty=True)


@task
def build_assets(c):
    if not shutil.which('go-assets-builder'):
        c.run('go install github.com/go-bindata/go-assets-builder@latest', pty=True)

    c.run(
        'go-assets-builder server/templates '
        '-o server/assets_templates.go -v AssetsTemplates --strip-prefix=/server/templates',
        pty=True
    )


@task(build_frontend, build_assets)
def run_dev(c):
    if not shutil.which('modd'):
        c.run('go install github.com/cortesi/modd/cmd/modd@latest', pty=True)

    def run_server():
        mongo_port = run_docker_mongo()
        sp.check_call(['modd'], env={
            'MONGO_HOSTS': 'localhost',
            'MONGO_PORT': str(mongo_port),
            **os.environ,
        })

    def run_frontend():
        sp.check_call(
            ['pnpm', 'run', 'build:watch'],
            cwd=FRONTEND_DIR,
            env={
                'NODE_ENV': 'development',
                **os.environ,
            }
        )

    with ThreadPoolExecutor(max_workers=2) as pool:
        pool.submit(run_server)
        pool.submit(run_frontend)


@task(build_frontend, build_assets)
def build(c):
    os.makedirs('out', exist_ok=True)
    with c.cd('./server'):
        c.run('go build -o ../out .', pty=True)


def run_docker_mongo(db_name=DEV_DB_NAME):
    logging.info('Start MongoDB using Docker')

    docker = get_docker()
    container_name = DOCKER_MONGO_NAME + '-' + db_name

    cont_id, is_running = get_container_data(docker, container_name)
    if not cont_id:
        sp.check_output((
            docker, 'run', '-d', '-P', '--name', container_name, 'mongo:4'
        ))
        cont_id, is_running = get_container_data(docker, container_name)

    if not is_running:
        sp.check_output((docker, 'start', cont_id))

    mongo_port = get_container_service_port(docker, cont_id, '27017/tcp')
    atexit.register(stop_docker_mongo)

    return mongo_port


def get_docker():
    return shutil.which('docker')


def get_container_data(docker, container_name):
    out = sp.check_output((docker, 'ps', '-a'), encoding='utf8').strip()

    cont_id = None
    is_running = None

    info_line = None
    for line in out.splitlines():
        if container_name in line:
            info_line = line
            break

    if not info_line:
        return cont_id, is_running

    cont_id, _ = info_line.strip().split(' ', 1)
    info = sp.check_output((docker, 'inspect', cont_id))

    info_data = json.loads(info)
    if not info_data:
        raise RuntimeError('Empty docker inspect info')

    is_running = info_data[0]['State']['Running']

    return cont_id, is_running


def get_container_service_port(docker, cont_id, internal_port):
    info = sp.check_output((docker, 'inspect', cont_id))

    info_data = json.loads(info)
    if not info_data:
        raise RuntimeError('Empty docker inspect info')

    port_data = info_data[0]['NetworkSettings']['Ports'].get(internal_port)
    if not port_data:
        raise RuntimeError(f'No port {internal_port} exposed')

    return port_data[0]['HostPort']


def stop_docker_mongo():
    docker = get_docker()
    cont_id, is_running = get_container_data(docker, DOCKER_MONGO_NAME)

    if is_running:
        logging.info('Stopping MongoDB')
        sp.check_output((docker, 'stop', cont_id))
