const download = require('download-git-repo');
const ora = require('ora');
const { mkDir, isExisDir, deleteDir, writeFile, log } = require('../lib/utils');
const path = require('path');

const packageTemplate = path.join(__dirname, '../', 'template/packageJson');
let projectGitPath = {
  EMP子项目: 'github:yin1039832061/jl-cloud-template#main',
  H5: 'github:Canoe-kong/demo-h5#main',
};
module.exports = async function createProject(name, project, packageName) {
  const projectPath = path.join(
    process.cwd(),
    `${name[0].toLowerCase()}${name.substring(1)}`
  );
  if (isExisDir(projectPath)) {
    log.error('项目已存在，请检查文件路径 ：' + process.cwd());
    process.exit();
    // deleteDir(projectPath)
  }
  await mkDir(projectPath);

  let packageJson =
    project === 'H5'
      ? {
          name,
          ...require(`${packageTemplate}/defaultH5.json`),
        }
      : {
          name: `@emp/${name}`,
          packageName: packageName || '',
          ...require(`${packageTemplate}/default.json`),
        };

  await writeFile(
    `${projectPath}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );
  const spinner = ora('Loading unicorns').start();

  spinner.text = '下载中,请等待...';

  download(projectGitPath[project], name, function (err) {
    if (!err) {
      spinner.succeed('创建成功！');
      log.success(
        `切换至项目文件夹 cd ${name[0].toLowerCase()}${name.substring(1)}`
      );
      log.success(
        `安装依赖并启动项目 npm install & npm run start 或 yarn & yarn start`
      );
      return;
    }
    spinner.fail(err);
    process.exit();
  });
};
