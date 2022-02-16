export function generatorFactory(componentData, level = 1) {
    const type = componentData.type;
    let result = '';
    // grid组件特殊处理
    if (/^grid\d?$/.test(type)) {
        result = generators.gridGenerator(componentData, level);
    }
    else {
        const generator = generators[`${type}Generator`];
        if (generator) {
            result = generator(componentData, level);
        }
    }
    return result;
};

// 打印空格，用于格式化代码
function printLevelSpace(level = 1) {
    return printSpace(level * 4);
}

function printSpace(spaceNumber) {
    let result = '';
    for (let i = 0; i < spaceNumber; i++) {
        result += ' ';
    }
    return result;
}

// 格式化属性，变成字符串
function formatProps(props) {
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

// 所有生成器集合，命名规则为UI Designer 组件的type + Generator -> <type>Generator
export const generators = {
    /**
    * grid组件生成器，用于生成grid组件相关内容
    * @param {Object} componentObject 组件的所有配置信息
    */
    gridGenerator(componentObject, level) {
        let result = '';
        const grid = componentObject;
        // 循环column中的子组件
        const loopList = (list) => {
            let _result = '';
            (list || []).forEach(c => {
                _result += 
`
${printLevelSpace(level + 3)}${generatorFactory(c, level + 3)}
`;
            });
            return _result;
        };

        // 循环column
        const loopCol = () => {
            let _result = '';
            (grid.columns || []).forEach(c => {
                _result += 
`
${printLevelSpace(level + 2)}<v-col span="${c.span}">
${printLevelSpace(level + 3)}${loopList(c.list)}
${printLevelSpace(level + 2)}</v-col>
`
            });
            return _result;
        };
        
        // 组织grid组件结构
        result = 
 `
${printLevelSpace(level)}<v-container>
${printLevelSpace(level + 1)}<v-row no-gutters>
${printLevelSpace(level + 2)}${loopCol()}
${printLevelSpace(level + 1)}</v-row>
${printLevelSpace(level)}</v-container>
`;
        return result;
    },
    /**
    * input组件生成器，用于生成grid组件相关内容
    * @param {Object} componentObject 组件的所有配置信息
    */
    inputGenerator(componentObject) {
        return `<SchemaFormInput ref="${componentObject.key}" ${formatProps(componentObject.col)} />`
    },
    /**
    * text组件生成器，用于生成grid组件相关内容
    * @param {Object} componentObject 组件的所有配置信息
    */
    textGenerator(componentObject) {
        return `<SchemaFormText ref="${componentObject.key}" ${formatProps(componentObject.col)} />`
    },
    /**
    * select组件生成器，用于生成grid组件相关内容
    * @param {Object} componentObject 组件的所有配置信息
    */
    selectGenerator(componentObject) {
        return `<SchemaFormSelect ref="${componentObject.key}" ${formatProps(componentObject.col)} />`
    },
    /**
    * button组件生成器，用于生成grid组件相关内容
    * @param {Object} componentObject 组件的所有配置信息
    */
    buttonGenerator(componentObject) {
        return `<SchemaFormButton ref="${componentObject.key}" ${formatProps(componentObject.col)} />`
    },
};