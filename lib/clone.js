const ora = require("ora"); // 进度条
const download = require("download-git-repo");
// import chalk from "chalk";

module.exports = async function (githubAddress, directoryPath) {
  const cloneSpinner = ora(`✈正在下载代码模板到${directoryPath}`).start();

  return new Promise((resolve, reject) => {
    download(
      `direct:${githubAddress}`,
      directoryPath,
      { clone: true },
      err => {
        if (err) {
          // cloneSpinner.fail();
          // console.log(chalk.red(err));
          reject(err);
          // return;
        } else {
          // cloneSpinner.succeed(chalk.green('项目拉取成功'));
          cloneSpinner.succeed('项目拉取成功');
          resolve();
        }
      }
    )
  })
};
