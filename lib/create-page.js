
const path = require('path');
const { isExisDir, getDirFiles, mkDir, cpFile, log } = require('./utils')

const templatePath = path.join(__dirname, '../', 'template/page')
const rootPath = process.cwd()
module.exports = async function (name) {
    const pagePath = path.join(rootPath, './', 'src/pages', name)
    const isExis = isExisDir(pagePath);
    const fileArrs = isExis ? await getDirFiles(pagePath) : []
    const templatePages = await getDirFiles(templatePath);
    const createFiles = async () => {
        for (let i = 0; i < templatePages.length; i++) {
            await cpFile(templatePath + '/' + templatePages[i], pagePath + '/' + templatePages[i])
        }
    }
    if (isExis && fileArrs.length > 0) {
        log.error('页面已存在 ,请检查文件路径 ：' + pagePath)
        return;
    } else if (isExis && fileArrs.length === 0) {
        createFiles()
    } else {
        await mkDir(pagePath)
        createFiles()
    }
}