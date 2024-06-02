#!/usr/bin/env node
import path from 'node:path';
import sh from 'shelljs';

const dirName = path.dirname(import.meta.url.replace('file://', ''));
const projectRoot = path.join(dirName, '..');
process.env.PATH = `${process.env.PATH}:${path.join(projectRoot, 'node_modules', '.bin')}`;

function main() {
    sh.exec(
        `typescript-json-schema \
            --required \
            --strictNullChecks \
            --excludePrivate \
            --out ${projectRoot}/src/schemas/acc/AccountStatePureData.json \
            ${projectRoot}/src/types/acc.ts \
            AccountStatePureData`
    );
}

main();
