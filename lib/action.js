const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require("ora");
const { spawn } = require("cross-spawn");
const axios = require('axios');
const clone = require("./clone");
const getFetchRepo = require("../utils/getFetchRepo");
const {frontendFrameArr, backendFrameArr} = require("../constant");
// const { loadingWrap } = require('../utils/loading');
// const { ejsCompile } = require('../utils/ejsCompile');
// const { writeFile, mkdirSync } = require('../utils/fileUtils');

// create
const createAction = async function (projectName, cmd) {
  await isFileCover(projectName, cmd);
}

// 判断文件是否存在，是否覆盖
const isFileCover = async (projectName, cmd) => {
  // 获取当前执行的目录路径
  const cwd = process.cwd();
  // 获取到要创建的地址
  const directoryPath = path.join(cwd, projectName);

  // 判断该目录存不存在
  if (fs.existsSync(directoryPath)) {
    if (cmd.force) {
      // 如果是强制创建, 删除目录后面直接创建
      await fs.remove(directoryPath);
    } else {
      // 提示用户是否确认覆盖
      const {chose} = await inquirer.prompt([ // 配置询问方式
        {
          name: 'chose',
          type: 'list', // 类型
          message: `${directoryPath}文件夹已存在，是否覆盖?`,
          choices: [
            { name: '覆盖', value: 'overwrite' },
            { name: '取消', value: false }
          ]
        }
      ]);

      // 覆盖就是删除再创建
      if (chose === 'overwrite') {
        // 移除已存在的目录
        console.log(chalk.hex("#ff8800").bold(`\r\n正在移除目录...`));
        await fs.remove(directoryPath);
        console.log(chalk.hex("#ff8800").bold(`\r\n目录移除成功！`));
        // await loadingWrap(fs.remove, '文件覆盖中', targetDir);
      } else {
        return;
      }
    }
  }

  // 创建目录
  const creator = new Creator(projectName, cwd, directoryPath);
  // 开始创建
  creator.fetchRepo();
}


class Creator {
  constructor(projectName, cwd, directoryPath) {
    this.cwd = cwd;
    this.projectName = projectName;
    this.directoryPath = directoryPath;
  }

  // async createProject() {
  //   // 获取仓库模版
  //   const repoDir = await this.fetchRepo();
  // }

  async fetchRepo() {
    // 失败重新拉取
    // let repos = await loadingWrap(fetchRepoList, '模版文件正在拉取中');

    // if (!repos) return false;

    // repos = repos.map(item => item.name)

    // 创建目标目录
    await fs.ensureDirSync(this.directoryPath);

    const { service }  = await inquirer.prompt([{
      name : 'service',
      type: 'list',
      message: chalk.yellow('请选择服务：'),
      choices: [
        { name: '前端', value: 'frontend' },
        { name: '后端', value: 'backend' },
        { name: '微前端', value: 'micro-frontend' },
        { name: 'monorepo', value: 'monorepo' },
      ]
    }])

    if (service === 'frontend') {
      getFetchRepo(frontendFrameArr);
    } else if (service === 'backend') {
      getFetchRepo(backendFrameArr);
    } else if (service === 'micro-frontend') {

    } else if (service === 'monorepo') {

    }
  }

  async download(frame) {
    console.log('frame', frame)
    const timeStart = new Date().getTime();
    const spinner = ora(`Downloading...${frame}`);
    let count = 0;

    // 拉取代码模板
    axios.get('https://api.github.com/users/HCYETY/repos')
      .then(repoArr => {
        repoArr.data.forEach(item => {
          if (item.name === frame) {
            console.log('item.name', item.name)
            spinner.start();
            clone(item.clone_url, this.directoryPath)
              .then(() => {
                spinner.succeed(`Success! Created ${this.projectName} at ${this.cwd}. 耗时${new Date().getTime() - timeStart}ms`);
                this.runNpm();
              })
              .catch(err => {
                spinner.fail(`Project template download failed.`);
                console.log(chalk.red(err));
                if (count < 3) {
                  console.log(chalk.yellow('尝试重新拉取代码模板'));
                  this.download(frame);
                  count++;
                } else {
                  spinner.fail(`代码模板拉取失败，次数已超过 3 次，不再自动拉取，请重新输入.`);
                }
              })
          }
        })
      }) .catch((err) => {
      console.log('获取 github 接口数据失败', err);
    })
  }

  async runNpm() {
    const installTime = new Date().getTime();
    const installing = ora("Installing...\n");
    installing.start();
    // windows系统兼容性处理
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const result = await spawn('cnpm', ['install', '-D'], {
      // stdio: ['inherit', 'pipe', 'inherit'],
      stdio: ['pipe', process.stdout, process.stderr],
      cwd: this.directoryPath
    });
    // 监听依赖安装状态
    result.on('close', async (code) => {
      if (code !== 0) {
        console.log(chalk.red('Error occurred while installing dependencies!'));
        process.exit(1);
      } else {
        console.log(chalk.hex("#67c23a").bold(`\r\nInstall finished  耗时${new Date() - installTime}ms`));
        installing.stop();
        console.log(chalk.green(
            `
            安装完成（${new Date().getTime() - installTime}ms）：
            To get Starat :
            ================================
              cd ${this.projectName}
              npm run dev
            ================================
            `
          )
        )
        // await spawn("cnpm", ["run", "start"], { cwd: `./${this.directoryPath}` });
        // console.log(chalk.hex("#ff8800").bold(`\r\ncd ${this.projectName}`));
        // console.log(chalk.hex("#ff8800").bold("\rnpm run dev"));
      }
    })
  }
}

module.exports = {
  createAction,
  Creator
}
