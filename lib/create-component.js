
const path = require('path')
const { isExisDir, getDirFiles, cpFile, mkDir, log } = require('./utils')

const templatePath = path.join(__dirname, '../', 'template/component')
const rootPath = process.cwd()
module.exports = async function (name) {
    let first = name[0];
    name = `${first.toUpperCase()}${name.substring(1)}`
    const componentPath = path.join(rootPath, './', 'src/components', name)
    const isExis = isExisDir(componentPath);
    const fileArrs = isExis ? await getDirFiles(componentPath) : []
    const templateComs = await getDirFiles(templatePath);
    const createFiles = async () => {
        for (let i = 0; i < templateComs.length; i++) {
            await cpFile(templatePath + '/' + templateComs[i], componentPath + '/' + templateComs[i])
        }
    }
    if (isExis && fileArrs.length > 0) {
        log.error('组件已存在 ,请检查文件路径 ：' + componentPath)
    } else if (isExis && fileArrs.length === 0) {
        createFiles()
    } else {
        let res = await mkDir(componentPath)
        if (res)
            createFiles()
        else
            log.error(`创建${name}文件夹`)
    }
    process.exit()
}