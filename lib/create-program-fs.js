const inquirer = require('inquirer'); // 启动交互命令行
const createProject = require('./create-project');
const createComponent = require('./create-component');
const createPage = require('./create-page');

const questions = [
  {
    type: 'list',
    name: 'mode',
    message: '请选择模板',
    choices: ['project', 'page', 'component'],
  },
  {
    type: 'list',
    name: 'project',
    message: '请选择项目类型',
    choices: ['EMP子项目', 'H5'],
    when: answers => answers.mode === 'project' || answers.mode === 'page',
  },
  {
    type: 'input',
    name: 'name',
    message: answers =>
      `请输入${
        answers.mode === 'project'
          ? '项目名(如demo-project)'
          : answers.mode === 'page'
          ? '页面(如home)'
          : '组件名称(如Table)'
      }:`,
  },
  {
    type: 'input',
    name: 'packageName',
    message: '请输入包名(如CloudMng):',
    when: answers =>
      answers.mode === 'project' && answers.project === 'EMP子项目',
  },
];
module.exports = function () {
  inquirer.prompt(questions).then(async answers => {
    const { mode, name, project, packageName } = answers;
    if (mode === 'project') {
      await createProject(name, project, packageName);
    } else if (mode === 'page') {
      await createPage(name, project);
    } else {
      await createComponent(name);
    }
  });
};
