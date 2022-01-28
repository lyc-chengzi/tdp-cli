import { program } from "commander";
import donwload from './download.js';
import { exec } from "node:child_process";
import chalk from "chalk";

program
    .argument('<projectName>', 'created project name')
    .option('-vv, --vue-version <version>', 'choose a vue version', "2")
    .action((projectName) => {
        // const options = program.opts();
        donwload(projectName, downloadSuccess);
    });
    // .requiredOption('-p, --project-name <projectName>', 'the project name');

program.parse(process.argv);

/**
 * 下载模板成功回调函数
 * @param {*} destPath 下载目录
 */
function downloadSuccess(destPath) {
    console.log(chalk.greenBright('项目创建完成'));
    console.log(chalk.cyan('第一步：执行 npm login登录私有npm仓库'));
    console.log(chalk.cyan('第二步：执行 npm install安装所有依赖'));
    console.log(chalk.cyan('第三步：执行 npm run serve启动项目并预览'));
}
