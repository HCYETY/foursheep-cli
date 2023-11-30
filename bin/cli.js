#!/usr/bin/env node
import {program} from "commander";
import initProject from '../lib/init';
import figlet from 'figlet';
import chalk from "chalk";
import {createAction} from '../lib/action.js'
// const program= require("commander");
// import package from '../package.json';
// const package = require('../package.json');
// const initProject = require("../lib/init");
// const figlet = require('figlet');
// const chalk = require("chalk");
// const {createAction} = require("../lib/action");
// const clear = require("clear");

program
  .version(`foursheep-cli@1`)
  // .version(`foursheep-cli@${package.version}`)
  .usage('<command> [option] ✅例如: foursheep init demo')
  .command("init <name>")
  .option("-y", "忽略 package.json 的信息输入")
  .description("♥Welcome to use foursheep-cli by foursheep")
  .action(initProject);

// 自定义--help中的选项
program
  .option('-u, --user', "output the tool's author")
  .action(() => {
    console.log(`this cli tool was made by foursheep`);
    // console.log(`this cli tool was made by ${package.author}`);
  })

program.on('--help', () => {
  console.log("")

  // 使用 figlet 绘制 Logo —— 打印欢迎界面
  // clear();
  // 封装一个输出绿色文字的API
  const log = (content) => console.log(chalk.green(content));
  const data = figlet.textSync("fs!Welcome");
  log(data);

  console.log("");
})

program
  .command("create <name>")
  .option("-f, --force", "当文件夹已经存在，是否强制创建")
  .description("♥create a new project")
  .action((value, options) => {
    createAction(value, options);
  });

program.parse(process.argv);
