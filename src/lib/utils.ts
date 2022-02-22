import { nodeType } from './model/index.js';
import NodeBase from './model/nodeBase.js';
import { ENodeType } from "./enum/index.js";
import { INode } from "../interface/index.js";
import chalk = require("chalk");

type componentJson = {
    key: string;
    type: ENodeType;
};

/**
 * 获取组件的node对象
 * @param {Object} c 组件的json数据 
 */
export function $getNodeByJson(c: componentJson): INode {
    // console.log('$getNodeByJson nodeList', nodeType);
    const nodeGenerator = nodeType[c.type];
    // grid组件
    if (/^grid\d?$/.test(c.type) && nodeType.grid) {
        const node = nodeType.grid(c);
        return {
            key: c.key,
            type: c.type,
            node,
        };
    }
    // 其他组件
    else if(nodeGenerator) {
        const node = nodeType[c.type](c);
        return {
            key: c.key,
            type: c.type,
            node,
        };
    }
    // 如果没有匹配类型的组件，则返回基类
    else {
        return {
            key: c.key,
            type: c.type,
            node: new NodeBase(c),
        };
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
