const inquirer = require('inquirer');                     // 启动交互命令行
const createProject = require('./create-project')
const createComponent = require('./create-component')
const createPage = require('./create-page')

const questions = [
    {
        type: 'list',
        name: 'mode',
        message: '请选择模板',
        choices: [
            'project',
            'page',
            'component'
        ]
    }, {
        type: 'input',
        name: 'name',
        // when: (answers) => answers.mode === "project",
        message: answers=>`请输入${answers.mode==="project"?"项目名(如demo-project)":answers.mode==="page"?"页面(如home)":"组件名称(如Table)"}:`,
    }
]
module.exports = function () {
    inquirer.prompt(questions).then(async answers => {
        const { mode, name } = answers;
        if (mode === "project") {
           await createProject(name)
        } else if (mode === "page") {
           await createPage(name)
        } else {
           await  createComponent(name)
        }
    })
}