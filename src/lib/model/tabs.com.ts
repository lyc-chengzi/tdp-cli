import { INode } from "../../interface/index.js";
import { $printLevelSpace, $getNodeByJson } from "../utils.js";
import NodeBase from "./nodeBase.js";
import Page from './page.js';

export default class Tab extends NodeBase {
    nodes: INode[] = [];
    constructor(json: any) {
        super(json);
        this.formatJson();
    }
    formatJson() {
        this.nodes = this.json.columns[0].list.map((c: any) => {
            return $getNodeByJson(c);
        });
    }
    toString(level?: number) {
        let result = '';
        // 组织grid组件结构
        result = 
 `
${$printLevelSpace(level)}<v-tabs>
${$printLevelSpace(level + 1)}${this.loopNodes(level + 1)}
${$printLevelSpace(level)}</v-tabs>`;
        return result;
    }

    // 循环list
    loopNodes(level: number) {
        let _result = '';
        this.nodes.forEach(c => {
            _result += 
`
${$printLevelSpace(level)}<v-tab>
${$printLevelSpace(level + 1)}${c.node.toString(level + 1)}
${$printLevelSpace(level)}</v-tab>
`
        });
        return _result;
    };

    // 向page的data中添加代码
    toData(pageInstance: Page) {
        let result = '';
        this.nodes.forEach(node => {
            if (node.node && node.node.toData) {
                result += node.node.toData(pageInstance);
            }
        });
        return result;
    }
    // 向page的method中添加代码
    toMethods(pageInstance: Page) {
        let result = '';
        this.nodes.forEach(node => {
            if (node.node && node.node.toMethods) {
                result += node.node.toMethods(pageInstance);
            }
        });
        return result;
    }
    // 向page的mounted中添加代码
    toMounted(pageInstance: Page) {
        let result = '';
        this.nodes.forEach(node => {
            if (node.node && node.node.toMounted) {
                result += node.node.toMounted(pageInstance);
            }
        });
        return result;
    }
}