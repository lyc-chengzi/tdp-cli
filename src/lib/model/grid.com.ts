import { INode } from "../../interface/index.js";
import { $printLevelSpace, $getNodeByJson } from "../utils.js";
import NodeBase from "./nodeBase.js";
import Page from './page.js';

interface IColumns {
    span: string;
    nodes: INode[];
}

export default class Grid extends NodeBase {
    columns: IColumns[] = [];
    constructor(json: any) {
        super(json);
        this.formatJson();
    }
    formatJson() {
        this.columns = this.json.columns.map((c: any) => {
            return {
                span: c.span,
                nodes: c.list.map((_c: any) => $getNodeByJson(_c)),
            };
        });
    }
    toString(level?: number) {
        let result = '';
        // 组织grid组件结构
        result = 
 `
${$printLevelSpace(level)}<v-container>
${$printLevelSpace(level + 1)}<v-row no-gutters>
${$printLevelSpace(level + 2)}${this.loopCol(level + 2)}
${$printLevelSpace(level + 1)}</v-row>
${$printLevelSpace(level)}</v-container>`;
        return result;
    }

    // 循环column
    loopCol(level: number) {
        let _result = '';
        this.columns.forEach(c => {
            _result += 
`
${$printLevelSpace(level)}<v-col span="${c.span}">
${$printLevelSpace(level + 1)}${this.loopNodes(c.nodes, level + 1)}
${$printLevelSpace(level)}</v-col>
`
        });
        return _result;
    };

    // 循环column中的子组件
    loopNodes(nodes: INode[], level: number) {
        let _result = '';
        nodes.forEach(node => {
            if(node.node) {
                _result += 
`
${$printLevelSpace(level)}${node.node.toString(level)}
`;
        
            }
        });
        return _result;
    };
    // 向page的data中添加代码
    toData(pageInstance: Page) {
        let result = '';
        this.columns.forEach(col => {
            col.nodes.forEach(node => {
                if (node.node && node.node.toData) {
                    result += node.node.toData(pageInstance);
                }
            });
        });
        return result;
    }
    // 向page的method中添加代码
    toMethods(pageInstance: Page) {
        let result = '';
        this.columns.forEach(col => {
            col.nodes.forEach(node => {
                if (node.node && node.node.toMethods) {
                    result += node.node.toMethods(pageInstance);
                }
            });
        });
        return result;
    }
    // 向page的mounted中添加代码
    toMounted(pageInstance: Page) {
        let result = '';
        this.columns.forEach(col => {
            col.nodes.forEach(node => {
                if (node.node && node.node.toMounted) {
                    result += node.node.toMounted(pageInstance);
                }
            });
        });
        return result;
    }
}