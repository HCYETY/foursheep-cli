import inquirer from "inquirer";
import chalk from "chalk";
import {Creator} from "../lib/action";

export default function (choices) {
  return inquirer
    .prompt([
      {
        name : 'frame',
        type: 'list',
        message: chalk.yellow('请选择框架：'),
        choices
      }
    ])
    .then(answer => {
      const creator = new Creator();
      creator.download(answer.frame);
    })
}
