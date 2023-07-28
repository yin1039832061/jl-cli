const path = require('path');
const {
  isExisDir,
  getDirFiles,
  mkDir,
  cpFile,
  log,
  upperCaseFirst,
} = require('./utils');

const rootPath = process.cwd();
module.exports = async function (name, project) {
  const pagePath = path.join(rootPath, './', 'src/pages', name);
  const isExis = isExisDir(pagePath);

  const templatePath =
    project === 'H5'
      ? path.join(__dirname, '../', 'template/page/h5-page')
      : path.join(__dirname, '../', 'template/page/emp-page');

  const fileArrs = isExis ? await getDirFiles(pagePath) : [];

  const templatePages = await getDirFiles(templatePath);

  const createFiles = async () => {
    for (let i = 0; i < templatePages.length; i++) {
      if (templatePages[i].indexOf('.tsx') > -1) {
        let dirPath = path.parse(
          templatePath + '/' + name + '/' + templatePages[i]
        ).dir;
        let parentPath = path.parse(dirPath).dir;
        let comName = upperCaseFirst(dirPath.replace(`${parentPath}/`, ''));
        await cpFile(
          templatePath + '/' + templatePages[i],
          pagePath + '/' + templatePages[i],
          { from: '`{ComName}`', to: comName }
        );
      } else {
        await cpFile(
          templatePath + '/' + templatePages[i],
          pagePath + '/' + templatePages[i]
        );
      }
    }
  };
  if (isExis && fileArrs.length > 0) {
    log.error('页面已存在 ,请检查文件路径 ：' + pagePath);
  } else if (isExis && fileArrs.length === 0) {
    await createFiles();
    log.success('创建成功');
  } else {
    let res = await mkDir(pagePath);
    if (res) await createFiles();
    else log.error('创建文件夹' + name + '失败');
  }
  process.exit();
};
