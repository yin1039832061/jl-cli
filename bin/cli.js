#!/usr/bin/env node

const version = require('../package.json').version || '1.0.0';
const program = require('commander');
const createProgramFs = require('../lib/create-program-fs');
const addComponent = require('../lib/add-component')


program
    .command('create')
    .description('创建项目、页面或组件')
    .action((cmd, options) => createProgramFs(cmd))

program
    .command('add')
    .description('拷贝组件到src/component')
    .action((cmd) => addComponent(cmd))

program
    .version(version);

program.parse(process.argv)
