import { program } from "commander";
import cloneProject from "../lib/download.js";
import getAppInfo from '../lib/getAppInfo.js';
// import { exec } from "node:child_process";
import * as Inquirer from "inquirer";
import createPages from "../lib/createPages.js";

// @ts-ignore
const inquirer: Inquirer.Inquirer = Inquirer.default;

program
    .argument("<projectName>", "created project name")
    .option("-itcode, --itcode <itcode>", "input your itcode", "")
    .option("-pwd, --password <itcode>", "input your password", "")
    .option("-appId, --app-id <appId>", "input a application id", "")
    .option("-vv, --vue-version <version>", "choose a vue version", "2")
    .action(projectName => {
        const options = program.opts();
        const itcode = options.itcode;
        const pwd = options.password;
        const appId = options.appId;
        if (itcode && pwd) {
            doCreate(itcode, pwd, appId, projectName);
        } else {
            inputUserNameAndPwd((itcode, pwd) => {
                doCreate(itcode, pwd, '', projectName);
            });
        }
    });
// .requiredOption('-p, --project-name <projectName>', 'the project name');

program.parse(process.argv);

function inputUserNameAndPwd(callback: (itcode: string, pwd: string) => void) {
    const questions: Inquirer.QuestionCollection = [
        {
            type: 'input',
            name: 'itcode',
            message: "输入 itcode",
            validate(input) {
                if (!input) {
                    return '请输入你的itcode'
                } else {
                    return true;
                }
            },
        },
        {
            type: 'password',
            name: 'password',
            message: "输入 密码",
            validate(input) {
                if (!input) {
                    return '请输入你的密码'
                } else {
                    return true;
                }
            },
        },
    ];

    inquirer
        .prompt(questions).then((answers: any) => {
            callback(answers.itcode, answers.password);
        });
}

/**
 * 下载模板成功回调函数
 * @param {*} destPath 下载目录
 */
function doCreate(itcode: string, pwd: string, appId: string, projectName: string) {
    // 1. 先判断用户是否有app权限，然后获取app信息，
    getAppInfo(itcode, pwd, appId, (data) => {
        // 2. clone项目模板
        cloneProject(projectName, (destPath: string) => {
            // 3. 根据json生成项目代码
            createPages(data, destPath);
        });
    });
}
