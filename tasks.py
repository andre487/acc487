import os
import shutil

# noinspection PyUnresolvedReferences
from invoke import task

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), 'frontend')


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
    c.run('go-assets-builder assets -o server/assets_static.go -v AssetsStatic --strip-prefix=/assets', pty=True)


@task(build_frontend, build_assets)
def run_dev(c):
    if not shutil.which('modd'):
        c.run('go install github.com/cortesi/modd/cmd/modd@latest', pty=True)
    c.run('modd', pty=True)


@task(build_frontend, build_assets)
def build(c):
    os.makedirs('out', exist_ok=True)
    with c.cd('./server'):
        c.run('go build -o ../out .', pty=True)
