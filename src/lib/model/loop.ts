import { INode } from "../../interface/index.js";
import { $printLevelSpace, $getNodeByJson, $formatProps, $formatEvents } from "../utils.js";
import NodeBase from "./nodeBase.js";
import Page from './page.js';

export default class Loop extends NodeBase {
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
        // 组织grid组件结构
        result = 
 `
${$printLevelSpace(level)}<functional-item
${$printLevelSpace(level + 1)}ref="${this.key}"
${$printLevelSpace(level + 1)}class="tdp-generator-loop"
${$printLevelSpace(level + 1)}:record="${this.key}_record"
${$printLevelSpace(level + 1)}:col="${this.key}_data"
${$printLevelSpace(level + 1)}type="${this.json.type}"
${$printLevelSpace(level + 1)}:edit="false"
${$printLevelSpace(level + 1)}:model="{}"
${$printLevelSpace(level + 1)}:apiBasic="{}"
${$printLevelSpace(level + 1)}:options="[]"
${$printLevelSpace(level)}>
${$printLevelSpace(level + 1)}<template #default="{ props }">
${$printLevelSpace(level + 2)}<functional-loop v-bind="props">
${$printLevelSpace(level + 3)}<div class="loop-wrapper" key="card0" #loopWrapper>
${$printLevelSpace(level + 3)}${this.loopNodes(level + 4)}
${$printLevelSpace(level + 3)}</div>
${$printLevelSpace(level + 2)}</functional-loop>
${$printLevelSpace(level + 1)}</template>
${$printLevelSpace(level)}</functional-item>`;
        return result;
    }

    // 循环column中的子组件
    loopNodes(level: number) {
        let _result = '';
        this.nodes.forEach(node => {
            if(node.node) {
                _result += `${node.node.toString(level)}`;
            }
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
        if (this.hasApi) {
            result += `
            ${this.key}_apiBasic: ${JSON.stringify(this.json.col.apiBasic, null, 4)},
            ${this.key}_apiData: {},`;
        }
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