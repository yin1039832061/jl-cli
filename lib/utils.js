const chalk = require('chalk');
const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

/**
 * 判断文件是否存在
 * @param {*} path
 * @returns
 */
const isExisDir = path => {
  return fs.existsSync(path);
};

const getDirFiles = async path => {
  let result = [];
  try {
    result = await fsPromise.readdir(path);
  } catch (err) {
    console.log(err);
  }
  return Array.isArray(result) ? result : [];
};

/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    });
  });
}

function mkdirectory(dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

const mkDir = async dirPath => {
  let isExists = await getStat(dirPath);
  if (isExists && isExists.isDirectory()) {
    return true;
  } else if (isExists) {
    mkdirectory(dirPath);
    return true;
  }
  let tempDir = path.parse(dirPath).dir; //拿到上级路径
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await mkDir(tempDir);
  let mkdirStatus;
  if (status) {
    mkdirStatus = await mkdirectory(dirPath);
  }
  return mkdirStatus;
};

const cpFile = async (source, target, replaceContent = {}) => {
  let fileContent = await fsPromise.readFile(source, 'utf8');
  const { from, to } = replaceContent;
  const regExp = new RegExp(from, 'g');
  if (replaceContent && from && to) {
    fileContent = fileContent.replace(regExp, to);
  }
  await writeFile(target, fileContent);
};

const writeFile = async (filePath, content) => {
  try {
    await fsPromise.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    console.error(error);
  }
};

const deleteDir = path => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(file => {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
  fs.rmdirSync(path);
};
const upperCaseFirst = word => {
  return `${word[0].toUpperCase()}${word.substring(1)}`;
};

const log = {
  success(msg) {
    console.log(chalk.green(`>> ${msg}`));
  },
  error(msg) {
    console.log(chalk.red(`>> ${msg}`));
  },
};
module.exports = {
  isExisDir,
  getDirFiles,
  mkDir,
  cpFile,
  deleteDir,
  writeFile,
  upperCaseFirst,
  log,
};
