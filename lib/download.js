import download from "download-git-repo";
import path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import logSymbols from "log-symbols";

export default function (projectName, cb) {
    const dirRoot = process.cwd();
    const destPath = path.join(dirRoot, projectName);
    console.log(`${chalk.bgBlue('当前运行目录')}: ${process.cwd()}`);

    const spinner = ora({
        text: chalk.yellow('正在下载模板'),
        spinner: 'hearts'
    }).start();
    setTimeout(() => {
        download(
            // "github:lyc-chengzi/tdp-vue2-temp#master",
            'https://github.com:lyc-chengzi/tdp-vue2-temp#main',
            destPath,
            { clone: true, checkout: false },
            err => {
                if (err) {
                    spinner.fail('下载模板失败');
                    // spinner.fail(chalk.red('下载模板失败'));
                    // console.error(chalk.red('\n下载模板错误'));                 
                    console.error('\n', logSymbols.error, err);
                } else {
                    // 下载模板成功
                    spinner.succeed('下载模板成功');
                    cb && cb(destPath);
                }
            }
        );
    }, 1000);
};
