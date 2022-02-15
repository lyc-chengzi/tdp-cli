import chalk from "chalk";
import logSymbols from "log-symbols";
import fs from "node:fs";
import path from "node:path";
import ora from 'ora';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const data1 = require('../data/lyc_test1.json');

let APPINFO = undefined;

/**
 * 生成页面代码
 * @param {string} appId 要生成的appId 
 * @param {string} projectPath 用户本地项目目录
 */
export default function createPages(appId, projectPath) {
    getAppInfo(appId)
        .then(() => {
            writePage(projectPath, () => {
                writeRouter(projectPath);
            });
        })
        .catch(e => {
            spinner.fail('获取app信息失败');
            console.error(e);
        });
}

/**
 * 写页面文件
 * @param {string} projectPath 
 * @param {function} callback 成功回调函数
 */
function writePage(projectPath, callback) {
    // 生成页面文件的路径
    const pagesPath = path.join(projectPath, 'src', 'views');

    const spinner = ora({
        text: chalk.yellow('正在写入页面文件'),
        spinner: 'star'
    }).start();
    const pages = getPages();
    const pageCount = pages.length;
    let successCount = 0;
    for(let i = 0; i < pageCount; i++) {
        const page = pages[i];
        fs.writeFile(path.join(pagesPath, `${page.commonPage.label}.vue`),
`
<template>
    <div>
        <div style="margin: 20px">
            <SchemaFormInput />
            <SchemaFormButton />
        </div>
    </div>
</template>

<script>
export default {
    name: '${page.id}',
    data: () => {
        return {};
    },
    methods: {},
};
</script>
`
        , {encoding: 'utf-8'}, (err) => {
            if (err) {
                spinner.fail(`写入页面文件${chalk.bgCyan(page.id)}-${chalk.bgCyan(page.commonPage.label)}时发生错误`);
                console.error(logSymbols.error, err);
            } else {
                spinner.succeed(chalk.bgCyan(page.id, '文件写入成功'));
                successCount++;
                if (successCount === pageCount) {
                    callback && callback();
                }
            }
        });
    }
}

/**
 * 写路由文件
 * @param {string} projectPath 
 */
function writeRouter(projectPath){
    // 生成路由配置文件的路径
    const routerPath = path.join(projectPath, 'src', 'router');

    const routerSpinner = ora({
        text: chalk.yellow('正在写入router文件'),
        spinner: 'star'
    }).start();
    
    fs.readFile(path.join(routerPath, 'index_temp.js'), {encoding: 'utf-8'}, (err, data) => {
        if(err) {
            routerSpinner.fail('写入router文件时发生错误');
            console.error(logSymbols.error, err);
        } else {
            const pages = getPages();
            const newImport = data.replace('///<inject_import>', `/* 添加需要引入的同步组件 */`);
            let pageRouters = '';
            pages.forEach(p => {
                pageRouters +=
`
    {
        path: '/views/${p.commonPage.label}',
        name: '${p.id}',
        component: () => import(/* webpackChunkName: "${p.id}" */ '../views/${p.commonPage.label}'),
    },
`
            });
            const newData = newImport.replace('///<inject_routes>', pageRouters);
            fs.writeFile(path.join(routerPath, 'index.js'), newData, {encoding: 'utf-8'}, (err2) => {
                if (err2) {
                    routerSpinner.fail('写入router文件时发生错误');
                    console.error(logSymbols.error, err2);
                } else {
                    routerSpinner.succeed(chalk.greenBright('router文件写入成功'));
                    fs.rm(path.join(routerPath, 'index_temp.js'), ()=>{}); // 删除模板文件
                }
            });
        }
    });
}

async function getAppInfo(appId) {
    APPINFO = {
        appId: appId,
        appContent: data1,
        appName: 'lyc_test1',
    };
    const spinner = ora({
        text: chalk.yellow(`获取Application[${chalk.bgCyan(appId)}]信息`),
        spinner: 'star'
    }).start();
    return new Promise((ok, fail) => {
        setTimeout(() => {
            spinner.succeed(chalk.greenBright('app信息获取完成'));
            ok(APPINFO);
        }, 500);
    });
}

function getPages() {
    if (!APPINFO) {
        return [];
    } else {
        return APPINFO.appContent.filter(c => c.hasOwnProperty('type'));
    }
}