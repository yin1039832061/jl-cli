const download = require('download-git-repo')
const ora = require('ora');
const inquirer = require('inquirer');
const { mkDir, isExisDir, deleteDir, writeFile, log } = require('../lib/utils');
const path = require('path')

const questions = [
    {
        type: 'input',
        name: 'packageName',
        message: '请输入包名(如CloudMng):'
    }
]
const packageTemplate = path.join(__dirname, '../', 'template/packageJson');
module.exports = async function createProject(name) {
    const projectPath = path.join(process.cwd(), `${name[0].toLowerCase()}${name.substring(1)}`);
    if (isExisDir(projectPath)) {
        log.error('项目已存在，请检查文件路径 ：' + process.cwd())
        process.exit()
        // deleteDir(projectPath)
    }
    mkDir(projectPath)
    const answer = await inquirer.prompt(questions)
    let packageJson = require(`${packageTemplate}/default.json`)
    packageJson = {
        name: `@emp/${name}`,
        packageName: answer.packageName || '',
        ...packageJson
    }
    writeFile(`${projectPath}/package.json`, JSON.stringify(packageJson, null, 2))
    const spinner = ora('Loading unicorns').start();
    spinner.text = '下载中,请等待...'
    download('github:yin1039832061/jl-cloud-template#main', name, function (err) {
        if (!err) {
            spinner.succeed('创建成功！')
            log.success(`切换至项目文件夹 cd ${name[0].toLowerCase()}${name.substring(1)}`)
            log.success(`安装依赖并启动项目 npm install & npm run start 或 yarn & yarn start`)
            return;
        }
        spinner.fail(err)
        process.exit()
    })
}