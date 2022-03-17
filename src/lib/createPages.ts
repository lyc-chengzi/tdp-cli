import fs = require("fs");
import fsPromise = require('fs/promises');
import path = require("path");
import chalk = require("chalk");
import ora = require('ora');
import ModelPage from "./model/page.js";

import { IAppInfo, IPageJson } from "../interface/index.js";
import { $error, $getPageName, $success } from "./utils.js";

let APPINFO: IAppInfo | undefined  = undefined;

/**
 * 生成页面代码
 * @param {string} appId 要生成的appId 
 * @param {string} projectPath 用户本地项目目录
 */
export default async function createPages(appInfo: IAppInfo, projectPath: string) {
    APPINFO = appInfo;
    await writeI18nAsync(projectPath);
    await configI18nAsync(projectPath);
    writePage(projectPath, () => {
        writeRouter(projectPath);
    });
}

/**
 * 写页面文件
 * @param {string} projectPath 
 * @param {function} callback 成功回调函数
 */
function writePage(projectPath: string, callback?: Function) {
    // 生成页面文件的路径
    const pagesPath = path.join(projectPath, 'src', 'views');
    const mixinPath = path.join(projectPath, 'src', 'views/mixins');
    const scriptPath = path.join(projectPath, 'src', 'views/scripts');

    const spinner = ora({
        text: chalk.yellow('正在写入页面文件'),
        spinner: 'star'
    }).start();
    const pages = getPages();
    const pageCount = pages.length;
    let successCount = 0;
    for(let i = 0; i < pageCount; i++) {
        const page = pages[i];
        const _p = new ModelPage(page);
        // 写vue文件
        fs.writeFile(
            path.join(pagesPath, `${_p.pageName}.vue`),
            _p.toString(),
            {encoding: 'utf-8'}, (err: Error) => {
                if (err) {
                    spinner.fail($error(`写入页面文件${chalk.yellow(page.id)}-${chalk.yellow(_p.pageName)}.vue时发生错误`));
                    console.error(err);
                } else {
                    // 写mixin文件
                    fs.writeFile(path.join(mixinPath, `${_p.pageName}_mixin.js`), _p.toMixin(), { encoding: 'utf-8' }, (err2) => {
                        if(!err2) {
                            // 写js文件
                            fs.writeFile(path.join(scriptPath, `${_p.pageName}_script.js`), _p.toScriptFile(), { encoding: 'utf-8' }, (err3) => {
                                if(!err3) {
                                    spinner.succeed($success(chalk.gray(`[${new Date().toLocaleString()}]`) + chalk.yellow(_p.pageName) + '文件写入成功'));
                                    successCount++;
                                    if (successCount === pageCount) {
                                        callback && callback();
                                    }                                
                                }
                                else {
                                    spinner.fail($error(`写入页面文件${chalk.yellow(page.id)}-${chalk.yellow(_p.pageName)}_script.js时发生错误`));
                                    console.error(err);
                                }
                            });
                        }
                        else {
                            spinner.fail($error(`写入页面文件${chalk.yellow(page.id)}-${chalk.yellow(_p.pageName)}_mixin.js时发生错误`));
                            console.error(err);
                        }
                    });
                }
            }
        );
    }
}

/**
 * 写多语言配置文件
 * @param {string} projectPath 
 * @param {function} callback 成功回调函数
 */
async function writeI18nAsync(projectPath: string) {
    return new Promise((resolve, reject) => {
        const locale = getAppLocaleResource();
        const localeCount = locale.length;
        // 生成文件的路径
        const i18nPath = path.join(projectPath, 'i18n');
        console.log(chalk.yellow('正在写入i18n文件...'));

        let promiseList = [];
        for(let i = 0; i < localeCount; i++) {
            const l = locale[i];             
            // 写language.json配置文件
            const promise = fsPromise.writeFile(
                    path.join(i18nPath, `${l.name}.json`),
                    JSON.stringify({app: l.app}),
                    {encoding: 'utf-8'}
                ).then(() =>{
                    return 'ok';
                }).catch(() => {
                    console.log($error(`写入i18n文件${chalk.yellow(l.name)}.json时发生错误`));
                    return 'fail';
                });
            promiseList.push(promise);
        }

        Promise.all(promiseList).then(datas => {
            if (datas.every(data => data === 'ok')) {
                console.log($success('i18n文件写入成功'));
                resolve('ok');
            } else {
                reject('fail');
            }            
        });
    });
}

// 设置i18n默认语言，和语言配置路径
async function configI18nAsync(projectPath: string) {
    console.log(chalk.yellow('正在配置i18n文件...'));
    const locales = getAppLocaleResource();
    const configFilePath = path.join(projectPath, 'src/plugins/i18n.js');
    let fileData = await fsPromise.readFile(
        configFilePath,
        {encoding: 'utf-8'}
    );
    let localeStr = '';
    locales.forEach(locale => {
        localeStr += `
    '${locale.name}': require('../../i18n/${locale.name}.json')`;
    });
    fileData = fileData.replace('///<inject_locales>', localeStr);

    const appSettings = getAppSettings();
    if (appSettings) {
        fileData = fileData.replace('///<inject_defaultLang>', appSettings.appSettings.appDefaultLanguage.code);
    }

    await fsPromise.writeFile(configFilePath, fileData, {encoding: 'utf-8'});

    console.log($success('配置i18n文件完成'));
}

/**
 * 写路由文件
 * @param {string} projectPath 
 */
function writeRouter(projectPath: string){
    // 生成路由配置文件的路径
    const routerPath = path.join(projectPath, 'src', 'router');

    const routerSpinner = ora({
        text: chalk.yellow('正在写入router文件'),
        spinner: 'star'
    }).start();
    
    fs.readFile(path.join(routerPath, 'index_temp.js'), {encoding: 'utf-8'}, (err: Error, data: string) => {
        if(err) {
            routerSpinner.fail($error('写入router文件时发生错误'));
            console.error(err);
        } else {
            const pages = getPages();
            const newImport = data.replace('///<inject_import>', `/* 添加需要引入的同步组件 */`);
            let pageRouters = '';
            pages.forEach((p, index) => {
                const pageName = $getPageName(p.commonPage.label);
                if(index === 0) {
                    pageRouters +=
`
    {
        path: '/',
        name: '${p.id}_home',
        component: () => import(/* webpackChunkName: "${p.id}_home" */ '../views/${pageName}'),
    },
`;
                }
                pageRouters +=
`
    {
        path: '/views/${pageName}',
        name: '${p.id}',
        component: () => import(/* webpackChunkName: "${p.id}" */ '../views/${pageName}'),
    },
`;
            });
            const newData = newImport.replace('///<inject_routes>', pageRouters);
            fs.writeFile(path.join(routerPath, 'index.js'), newData, {encoding: 'utf-8'}, (err2: Error) => {
                if (err2) {
                    routerSpinner.fail($error('写入router文件时发生错误'));
                    console.error(err2);
                } else {
                    routerSpinner.succeed($success('router文件写入成功'));
                    fs.rm(path.join(routerPath, 'index_temp.js'), ()=>{}); // 删除模板文件
                }
            });
        }
    });
}

// 获取所有页面配置
function getPages(): IPageJson[] {
    if (!APPINFO) {
        return [];
    } else {
        return APPINFO.appContent.filter((c:any) => c.id && c.id.indexOf('Page') === 0);
    }
}

// 获取应用多语言资源配置
function getAppLocaleResource(): any[] {
    if (!APPINFO) {
        return [];
    } else {
        const resourceConfig = APPINFO.appContent.find((c:any) => !!c.appLocaleResource);
        if(resourceConfig) {
            return resourceConfig.appLocaleResource || [];
        } else {
            return [];
        }
    }
}

// 获取应用配置
function getAppSettings() {
    if (!APPINFO) {
        return undefined;
    } else {
        return APPINFO.appContent.find((c:any) => !!c.appSettings);
    }
}