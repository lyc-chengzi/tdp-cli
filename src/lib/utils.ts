import Grid from "./model/grid.js";
import Input from "./model/input.js";
import Select from "./model/select.js";
import Button from "./model/button.js";
import Text from './model/text.js';
import { ENodeType } from "./enum/index.js";
import { INode } from "../interface/index.js";
import chalk from "chalk";

const nodeType = {
    [ENodeType.grid](json: Object) {
        return new Grid(json);
    },
    [ENodeType.input](json: Object) {
        return new Input(json);
    },
    [ENodeType.select](json: Object) {
        return new Select(json);
    },
    [ENodeType.button](json: Object) {
        return new Button(json);
    },
    [ENodeType.text](json: Object) {
        return new Text(json);
    },
};

type componentJson = {
    key: string;
    type: ENodeType;
};

/**
 * 获取组件的node对象
 * @param {Object} c 组件的json数据 
 */
export function $getNodeByJson(c: componentJson): INode {
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