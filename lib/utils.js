
const chalk = require('chalk')
const fs = require('fs')
const fsPromise = require('fs/promises')

const isExisDir = (path) => {
    return fs.existsSync(path)
}

const getDirFiles = async (path) => {
    let result = [];
    try {
        result = await fsPromise.readdir(path)
    } catch (err) {
        console.log(err)
    }
    return Array.isArray(result) ? result : []
}

const mkDir = async (path) => {
    await fsPromise.mkdir(path)
}

const cpFile = async (source, target) => {
    return await fsPromise.copyFile(source, target)
}

const writeFile = async (filePath, content) => {
    await fsPromise.writeFile(filePath, content, 'utf-8')
}

const deleteDir = (path) => {
    let files = []
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteDir(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
    }
    fs.rmdirSync(path)
}

const log = {
    success(msg) {
        console.log(chalk.green(`>> ${msg}`))
    },
    error(msg) {
        console.log(chalk.red(`>> ${msg}`))
    }
}
module.exports = {
    isExisDir,
    getDirFiles,
    mkDir,
    cpFile,
    deleteDir,
    writeFile,
    log,
}