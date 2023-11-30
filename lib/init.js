const shell = require('shelljs');
// const symbol = require('log-symbols');
const fs = require('fs');
// const fsExtra = require('fs-extra');
const ora = require('ora');
const path = require('path');
// const inquirer = require('inquirer');
const clone = require('../lib/clone');
const chalk = require("chalk");
const spinner = ora();

module.exports = async function (projectName) {
  const directoryPath = process.cwd();
  // 检查控制台是否可运行 git
  if (!shell.which('git')) {
    console.log(chalk.red('git 命令不可使用'));
    shell.exit(1);
  }
  // 是否进入新创建的文件目录
  if (!projectName) {
    console.log(chalk.bold.red('Error! You must enter a new project name.'));
    return;
  }
  // 验证 projectName 输入是否合法
  // if (projectName.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
  //   console.log('项目名称存在非法字符！');
  //   return;
  // }
  // 验证 projectName 是否存在
  if (fs.existsSync(projectName)) {
    console.log(chalk.bold.red(`Error! The ${projectName} folder already exists at ${directoryPath}.`));
    return;
  }

  spinner.start(`Start downloading templates for ${projectName}.\n`);

  // 拉取代码模板
  clone(directoryPath, projectName)
    .then(() => {
      spinner.succeed(`Success! Created ${projectName} at ${directoryPath}.`);
    })
    .catch(err => {
      spinner.fail(`Project template download failed.`);
      console.log(chalk.red(err));
    })

  // // 下载完毕后，定义自定义问题
  // let questions = [
  //   {
  //     type: 'input',
  //     message: `请输入项目名称：（${name}）`,
  //     name: 'name',
  //     validate(val) {
  //       if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
  //         return '项目名称包含非法字符'
  //       }
  //       return true;
  //     }
  //   },
  //   {
  //     type: 'input',
  //     message: '请输入项目关键词（,分割）：',
  //     name: 'keywords'
  //   },
  //   {
  //     type: 'input',
  //     message: '请输入项目简介：',
  //     name: 'description'
  //   },
  //   {
  //     type: 'input',
  //     message: '请输入您的名字：',
  //     name: 'author'
  //   },
  // ];
  // // 通过inquirer获取用户输入的回答
  // let answers = await inquirer.prompt(questions);
  //
  // // 将用户配置信息打印一下，确认是否正确
  // console.log('---------------------');
  // console.log(answers);
  // // 确认是否创建
  // let confirm = await inquirer.prompt([{
  //   type: 'confirm',
  //   message: '是否确认创建项目',
  //   default: 'Y',
  //   name: 'isConfirm'
  // }]);
  // if (!confirm.isConfirm) {
  //   return false;
  // }
  //
  // // 根据用户输入，调整配置文件
  // // 读取package.json文件
  // let jsonData = fs.readFileSync(`./${name}/package.json`, function(err, data) {
  //   console.log('读取文件', err, data);
  // })
  // jsonData = JSON.parse(jsonData)
  // Object.keys(answers).forEach(item => {
  //   if (item === 'name') {
  //     // 如果未输入项目名，则使用文件夹名
  //     jsonData[item] = answers[item] && answers[item].trim() ? answers[item] : name
  //   } else if (answers[item] && answers[item].trim()) {
  //     jsonData[item] = answers[item]
  //   }
  // })
  // console.log('jsonData', jsonData);
  // // 写入
  // let obj = JSON.stringify(jsonData, null, '\t')
  // fs.writeSync(`./${name}/package.json`, obj, function(err, data) {
  //   console.log('写入文件', err, data);
  // })
  // // 初始化git
  // if (shell.exec(`cd ${shell.pwd()}/${name} && git init`).code !== 0) {
  //   console.log(symbol.error, chalk.red('git 初始化失败'));
  //   shell.exit(1)
  // }
  // // 自动安装依赖
  // const installSpinner = ora('正在安装依赖…').start();
  // if (shell.exec(`cd ${shell.pwd()}/${name} && npm config set registry ${registry} && npm install -d`).code !== 0) {
  //   console.log(symbol.error, chalk.yellow('自动安装依赖失败，请手动安装'));
  //   shell.exit(1)
  // }
  // installSpinner.succeed(chalk.green('依赖安装成功'))
  // installSpinner.succeed(chalk.green('项目创建完成'))
  // shell.exit(1)
}
