import { INode } from "../../interface/index.js";
import { $printLevelSpace, $getNodeByJson, $formatProps, $formatEvents } from "../utils.js";
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
        // 组织tabs组件结构
        result = 
 `
${$printLevelSpace(level)}<functional-item
${$printLevelSpace(level + 1)}ref="${this.key}"
${$printLevelSpace(level + 1)}class="tdp-generator-tabs"
${$printLevelSpace(level + 1)}:record="${this.key}_record"
${$printLevelSpace(level + 1)}:col="${this.key}_data"
${$printLevelSpace(level + 1)}type="${this.json.type}"
${$printLevelSpace(level + 1)}:edit="false"
${$printLevelSpace(level + 1)}:model="{}"
${$printLevelSpace(level + 1)}:apiBasic="{}"
${$printLevelSpace(level + 1)}:options="[]"
${$printLevelSpace(level)}>
${$printLevelSpace(level + 1)}<template #default="{ props }">
${$printLevelSpace(level + 2)}<functional-tabs v-bind="props">
${$printLevelSpace(level + 2)}${this.loopTabs(level + 3)}
${$printLevelSpace(level + 2)}</functional-tabs>
${$printLevelSpace(level + 1)}</template>
${$printLevelSpace(level)}</functional-item>`;
        return result;
    }

    loopTabs(level: number) {
        let result = '';

        this.tabs.forEach((tab, index) => {
            result += `
${$printLevelSpace(level)}<div class="tab-wrapper" key="tabs_${index}" slot="${this.json.type}${index}">${this.loopNodes(tab.list, level + 1)}
${$printLevelSpace(level)}</div>`;
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
        result += `
            ${this.key}_data: {
                type: '${this.json.type}',
                apiItemize: undefined,
                attrs: {
                    type: '${this.json.type}',${$formatProps(this.json.col)}
                },
                formItem: {label: '${this.json.label}'},
                on: ${JSON.stringify($formatEvents(this.json.col), null, 4)},
                prop: '${this.key}',
                ref: '${this.key}',
            },`;

        let copyRecord = JSON.parse(JSON.stringify(this.json));
        copyRecord.columns = copyRecord.columns.map((c: any) => {
            return {
                ...c,
                list: (c.list || []).map(() => ({})),
            };
        });
        result += `
            ${this.key}_record: ${JSON.stringify(copyRecord)},`;
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