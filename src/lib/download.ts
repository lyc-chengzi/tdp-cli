import download from "download-git-repo";
import * as fs from 'node:fs';
import * as path from 'node:path';
import chalk from 'chalk';
import ora from 'ora';
import logSymbols from "log-symbols";
import { $error, $success } from "./utils.js";

export default function cloneProject(projectName: string, successCallback?: (destPath: string) => void) {
    const dirRoot = process.cwd();
    const destPath = path.join(dirRoot, projectName);
    console.log(`${chalk.bgBlue('当前运行目录')}: ${process.cwd()}`);

    const existsProjectFolder = fs.existsSync(destPath);
    if (existsProjectFolder) {
        console.warn(chalk.yellowBright(`😣项目名称已存在，请重命名或者删除原有项目！ --> ${destPath}`));
        return;
    }

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
            (err: Error) => {
                if (err) {
                    spinner.fail($error('下载模板失败'));             
                    console.error('\n', logSymbols.error, err);
                } else {
                    // 下载模板成功
                    spinner.succeed($success('下载模板成功'));
                    successCallback && successCallback(destPath);
                }
            }
        );
    }, 1000);
};
