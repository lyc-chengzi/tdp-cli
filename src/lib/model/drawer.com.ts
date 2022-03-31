import { INode } from "../../interface/index.js";
import { $printLevelSpace, $getNodeByJson } from "../utils.js";
import NodeBase from "./nodeBase.js";
import Page from './page.js';

export default class Drawer extends NodeBase {
    nodes: INode<NodeBase>[] = [];
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
        // 组织drawer组件结构
        result = 
 `
${$printLevelSpace(level)}<functional-item
${$printLevelSpace(level + 1)}ref="${this.key}"
${$printLevelSpace(level + 1)}class="tdp-generator-drawer"
${$printLevelSpace(level + 1)}:record="${this.key}_record"
${$printLevelSpace(level + 1)}:col="${this.key}_data"
${$printLevelSpace(level + 1)}type="${this.json.type}"
${$printLevelSpace(level + 1)}:edit="false"
${$printLevelSpace(level + 1)}:model="{}"
${$printLevelSpace(level + 1)}:apiBasic="{}"
${$printLevelSpace(level + 1)}:options="[]"
${$printLevelSpace(level)}>
${$printLevelSpace(level + 1)}<template #default="{ props }">
${$printLevelSpace(level + 2)}<functional-drawer v-bind="props">
${$printLevelSpace(level + 3)}<div class="drawer-wrapper" key="drawer0">
${$printLevelSpace(level + 3)}${this.loopNodes(level + 4)}
${$printLevelSpace(level + 3)}</div>
${$printLevelSpace(level + 2)}</functional-drawer>
${$printLevelSpace(level + 1)}</template>
${$printLevelSpace(level)}</functional-item>`;
        return result;
    }

    // 循环column中的子组件
    loopNodes(level: number) {
        let _result = '';
        this.nodes.forEach(node => {
            if(node.node) {
                _result += `${$printLevelSpace(level)}${node.node.toString(level)}`;
            }
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
        result += `
            ${this.key}Opened() {
                
            },
            ${this.key}Closed() {
                
            },
        `;
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