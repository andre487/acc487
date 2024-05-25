import os
import shutil
import subprocess as sp
from concurrent.futures import ThreadPoolExecutor

# noinspection PyUnresolvedReferences
from invoke import task

ROOT_DIR = os.path.dirname(__file__)
SERVER_DIR = os.path.join(ROOT_DIR, 'server')
FRONTEND_DIR = os.path.join(ROOT_DIR, 'frontend')


@task
def build_frontend(c):
    with c.cd(FRONTEND_DIR):
        if not os.path.exists('node_modules'):
            c.run('pnpm install')
        c.run('pnpm run build')


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
        sp.check_call(['modd'])

    def run_frontend():
        sp.check_call(['pnpm', 'run', 'build:watch'], cwd=FRONTEND_DIR)

    with ThreadPoolExecutor(max_workers=2) as pool:
        pool.submit(run_server)
        pool.submit(run_frontend)


@task(build_frontend, build_assets)
def build(c):
    os.makedirs('out', exist_ok=True)
    with c.cd('./server'):
        c.run('go build -o ../out .', pty=True)
