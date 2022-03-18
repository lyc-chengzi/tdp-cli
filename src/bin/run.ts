import { program } from "commander";
import cloneProject from "../lib/download.js";
import createPages from "../lib/createPages.js";
const path = require('path');
const data = require('../data/lyc_test1.json');
const del = require('del');
import fs = require('fs/promises');
import chalk  = require('chalk');
import { $decryptData } from "../lib/utils.js";

program
    .argument("<projectName>", "input a project name")
    .action(async (projectName: string) => {
        await del([path.join(process.cwd(), projectName)]);
        const runPath = process.cwd();
        const fileNames = await fs.readdir(runPath);
        const matchFileNames = fileNames.filter(fileName => /.uid$/i.test(fileName));
        let appJson = {};
        if (matchFileNames.length === 1) {

            const dataString = await fs.readFile(path.join(runPath, matchFileNames[0]));
            const jsonString = $decryptData(dataString.toString('utf-8'));
            appJson = JSON.parse(jsonString);
        }
        else if (matchFileNames.length > 1) {
            console.warn(chalk.yellowBright('当前目录查询到多个.uid文件，请保留一个再执行此命令'));
            return;
        }
        else {
            console.warn(chalk.yellowBright('没有在当前目录查询到.uid文件，无法运行此命令'));
            return;
        }
        console.log(chalk.greenBright('解析uid文件完成'));
        // console.log('json', appJson);

        const _data = {
            appContent: appJson,
        } as any;
        
        cloneProject(projectName, (destPath: string) => {
            // 3. 根据json生成项目代码
            createPages(_data, destPath);
        });
    });
// .requiredOption('-p, --project-name <projectName>', 'the project name');

program.parse(process.argv);
