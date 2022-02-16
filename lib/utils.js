import Grid from "./model/grid.js";
import Input from "./model/input.js";
import Select from "./model/select.js";
import Button from "./model/button.js";
import Text from './model/text.js';

const nodeType = {
    grid(json) {
        return new Grid(json);
    },
    input(json) {
        return new Input(json);
    },
    select(json) {
        return new Select(json);
    },
    button(json) {
        return new Button(json);
    },
    text(json) {
        return new Text(json);
    },
};

/**
 * 获取组件的node对象
 * @param {Object} c 组件的json数据 
 */
export function $getNodeByJson(c) {
    if (/^grid\d?$/.test(c.type)) {
        const node = nodeType.grid(c);
        return {
            key: c.key,
            type: c.type,
            node,
        };
    } else {
        const constructor = nodeType[c.type];
        if (constructor) {
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

export function $printSpace(spaceNumber) {
    let result = '';
    for (let i = 0; i < spaceNumber; i++) {
        result += ' ';
    }
    return result;
}
// 格式化属性，变成字符串
export function $formatProps(props) {
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