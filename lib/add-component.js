const inquirer = require('inquirer')

const questions = [
    {
        type: 'list',
        name: 'select',
        message: '请选择组件',
        choices: [
            'Table',
            'UploadImage'
        ]
    }
]
module.exports = async function () {
    inquirer.prompt(questions).then(answers => {
        const { select } = answers;
        
    })
}