// import { createRequire } from 'module';
import ora = require('ora');
import chalk = require('chalk');
// import * as Inquirer from "inquirer";
import inquirer = require('inquirer');
import { IAppInfo } from "../interface/index.js";
import { $error, $success } from './utils.js';

// const require = createRequire(import.meta.url);
const data1 = require('../data/lyc_test.json');

// @ts-ignore
// const inquirer: Inquirer.Inquirer = Inquirer.default;

// 根据用户输入或者选择的appId，获取app的json
export default function getAppInfo(
    itcode: string,
    pwd: string,
    appId: string,
    successCallback?: (appInfo: IAppInfo) => void
) {
    if (appId) {
        // 如果用户直接输入了appId，则获取对应appid
        fetchAppInfo(itcode, pwd, appId).then(data => {
            successCallback && successCallback(data);
        }).catch(e => {
            console.error($error('获取app信息时发生错误'));
            console.error(e);
        });
    } else {
        // 如果用户没输入appId，则需要拉取用户有权限查看的app列表
        getAppList(itcode, pwd)
            .then(data => {
                inquirer
                    .prompt([
                        {
                            type: "checkbox",
                            message: "选择您要生成项目的app",
                            name: "apps",
                            choices: data,
                            validate(answer) {
                                if (answer.length !== 1) {
                                    return "只能选择一个项目";
                                }

                                return true;
                            },
                        },
                    ])
                    .then(answers => {
                        fetchAppInfo(itcode, pwd, answers.appId || '')
                            .then(data => {
                                successCallback && successCallback(data);
                            })
                            .catch(e => {
                                console.error($error('获取应用信息时出现异常'));
                                console.error(e);
                            });
                    });
            })
            .catch(e => {
                console.error($error('获取应用列表时出现异常'));
                console.error(e);
            });
    }
}

function getAppList(itcode: string, pwd: string) {
    return new Promise((ok, fail) => {
        setTimeout(() => {
            ok([
                {
                    appId: "111",
                    name: "测试1",
                },
                {
                    appId: "222",
                    name: "测试2",
                },
                {
                    appId: "333",
                    name: "测试3",
                },
            ]);
        }, 500);
    });
}

function fetchAppInfo(itcode: string, pwd: string, appId: string): Promise<IAppInfo> {
    const APPINFO = {
        appId: appId,
        appContent: data1,
        appName: 'lyc_test1',
    };
    const spinner = ora({
        text: chalk.yellow(`获取Application[${chalk.bgCyan(appId)}]信息`),
        spinner: 'star'
    }).start();

    return new Promise((ok, fail) => {
        if (itcode.length > 2) {
            spinner.succeed($success('app信息获取完成'));
            ok(APPINFO);
        } else {
            spinner.fail($error('没有app权限'));
            fail();
        }
    });
}