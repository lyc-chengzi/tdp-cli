import { INode } from "../../interface/index.js";
import { $printLevelSpace, $getNodeByJson } from "../utils.js";
import NodeBase from "./nodeBase.js";
import Page from './page.js';

export default class Tab extends NodeBase {
    tabs: any[] = [];
    nodes: INode[] = [];
    constructor(json: any) {
        super(json);
        this.formatJson();
    }
    formatJson() {
        this.tabs = this.json.columns;
        this.tabs.forEach(tab => {
            (tab.list || []).forEach((nodeJson: any) => {
                this.nodes.push($getNodeByJson(nodeJson));
            });
        });
    }
    toString(level?: number) {
        let result = '';
        // 组织grid组件结构
        result = 
 `
${$printLevelSpace(level)}<v-tabs class="tdp-generator-tabs">${this.loopTabs(level + 1)}
${$printLevelSpace(level)}</v-tabs>`;
        return result;
    }

    loopTabs(level: number) {
        let result = '';
        this.tabs.forEach(tab => {
            result += `
${$printLevelSpace(level)}<v-tab>${this.loopNodes(tab.list, level + 1)}
${$printLevelSpace(level)}</v-tab>`;
        });
        return result;
    }

    // 循环list
    loopNodes(list: any, level: number) {
        let _result = '';
        list.forEach((nodeJson: any) => {
            _result += `${$printLevelSpace(level)}${$getNodeByJson(nodeJson).node.toString(level)}`;
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