import { nodeType } from './model/index.js';
import { ENodeType } from "./enum/index.js";
import { INode } from "../interface/index.js";
import chalk from "chalk";
import { createRequire } from 'module';
import * as fs from "node:fs";
import * as path from "node:path";

const require = createRequire(import.meta.url);

const nodeList: any = {};

type componentJson = {
    key: string;
    type: ENodeType;
};

/**
 * 获取组件的node对象
 * @param {Object} c 组件的json数据 
 */
export function $getNodeByJson(c: componentJson): INode {
    // console.log('$getNodeByJson nodeList', nodeList);
    if (/^grid\d?$/.test(c.type)) {
        const node = nodeType.grid(c);
        return {
            key: c.key,
            type: c.type,
            node,
        };
    } else {
        // @ts-ignore
        const constructor = nodeType[c.type];
        if (constructor) {
            // @ts-ignore
            const node = nodeType[c.type](c);
            return {
                key: c.key,
                type: c.type,
                node,
            };
        }
        else {
            return {
                key: c.key,
                type: c.type,
                node: null,
            };
        }
    }
}

// 打印空格，用于格式化代码
export function $printLevelSpace(level = 1) {
    return $printSpace(level * 4);
}

export function $printSpace(spaceNumber: number) {
    let result = '';
    for (let i = 0; i < spaceNumber; i++) {
        result += ' ';
    }
    return result;
}
// 格式化属性，变成字符串
export function $formatProps(props: any) {
    let result = ' ';
    if(props) {
        for(let key in props) {
            const prop = props[key];
            if (prop.type === "string") {
                result += `${key}="${prop.value}" `;
            }
            else if (prop.type === "boolean") {
                result += `:${key}="${prop.value}" `;
            }
        }
        return result;
    }
    else return '';
}

export function $success(text: string) {
    return '😎  ' + chalk.greenBright(text);
}

export function $error(text: string) {
    return '😈  ' + chalk.redBright(text);
}

function loadFile(path: string) {
    console.log('loadfile path:', path);
    return require(path);
}

export function $loadDir(dirPath: string) {
    let patcher: any = {};
    const basePath = process.cwd();
    fs.readdirSync(path.join(basePath, dirPath)).forEach(fileName => {
        console.log('fileName', fileName);
        if(/\.js$/.test(fileName)) {
            const name = path.basename(fileName, '.js');
            console.log('name', name);
            var _load = loadFile.bind(null, path.join(basePath, dirPath, fileName));
            patcher.__defineGetter__(name, _load);
        }
    });
    return patcher;
}

export async function $importFile(dirPath: string) {
    try {
        const modulesDir = path.join(dirPath);
        console.log('modulesDir', modulesDir, path.resolve('.'));
        fs.readdirSync(modulesDir).forEach(async (fileName) => {
            // console.log('fileName', fileName);
            if(/\.js$/.test(fileName)) {
                const name = path.basename(fileName, '.js');
                // console.log('name', name);
                const nodeModel = await import('file://' + path.join(modulesDir, fileName));
                nodeList[name] = function(json: any){
                    return new nodeModel.default(json);
                };
            }
            // console.log('nodeList', nodeList);
        });
        return nodeList;
    } catch (e) {
        console.error(chalk.redBright('加载组件解析文件时错误。', e));
    }
}

// $importFile('./lib/model');
