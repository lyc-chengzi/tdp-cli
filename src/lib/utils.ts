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
            node: new NodeBase(c) as any,
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
    let result = '';
    if(props) {
        for(let key in props) {
            const prop = props[key];
            if (prop.type === "string" || typeof prop.value === 'string') {
                result += `
                '${key}': '${prop.value.replace(/\\n/g, '\\n')}',`;
            }
            else if (prop.type === "boolean") {
                result += `
                '${key}': ${prop.value},`;
            }
            else if (prop.value instanceof Array) {
                result += `
                '${key}': ${JSON.stringify(prop.value)},`;
            }
            else if (typeof prop.value === 'object') {
                result += `
                '${key}': ${JSON.stringify(prop.value)},`;
            }
            else {
                result += `
                '${key}': '${(prop.value || '').toString()}',`;
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

export const componentNameMapping: string[] = [
    'input',
    'select',
    'radio',
    'datepicker',
    'DatetimePicker',
    'cascader',
    'placeholder',
    'checkbox',
    'slider',
    'timeselect',
    'timepicker',
    'jsoneditor',
    'quill',
    'codemirror',
    'ratings',
    'switch',
    'colorpicker',
    'tags',
    'Progress',
    'alert',
    'button',
    'divider',
    'nav1',
    'SidebarMenu',
    'nav2',
    'navBar',
    'table',
    'textarea',
    'uploadfile',
    'tabs',
    'paragraph',
    'title',
    'text',
    'Steppers',
    'Tooltip',
    'Ratings',
    'Timelines',
    'avatar',
    'card',
    'input',
    'select',
    'radio',
    'datepicker',
    'cascader',
    'placeholder',
    'checkbox',
    'combobox',
    'slider',
    'timeselect',
    'timepicker',
    'jsoneditor',
    'quill',
    'codemirror',
    'ratings',
    'switch',
    'colorpicker',
    'tags',
    'Progress',
    'alert',
    'button',
    'divider',
    'nav1',
    'SidebarMenu',
    'nav2',
    'navBar',
    'table',
    'textarea',
    'uploadfile',
    'tabs',
    'paragraph',
    'title',
    'text',
    'Steppers',
    'Tooltip',
    'Ratings',
    'Timelines',
    'Avatars',
    'Carousels',
    'iframe',
    'tree',
    'image',
    'pdf',
    'modals',
    'list',
    'html',
    'Itemgroups',
    'singleWeek',
    'scrollList',
    'BasicDatePicker',
    'TinymceEditor',
    'Autocomplete',
    'anchor',
    'expansionPanels',
    'changeImg'
];

export function $getComponentNameByType(type: string) {
    const componentName = componentNameMapping.find(c => c === type);
    if (componentName) {
        return `schema-form-${componentName}`;
    } else {
        return 'div';
    }
}

export function $getPageName(name: string) {
    if(!name) {
        return '';
    } else {
        const reg = /[^\w]/g;
        return name.replace(reg, '_');
    }
}