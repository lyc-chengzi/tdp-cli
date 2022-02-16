import { $getNodeByJson } from "../utils.js";

// 页面对象
export default class ModelPage {
    id = '';
    json = {};
    nodes = []; // 虚拟节点
    methods = [];
    data = [];
    constructor(json) {
        this.id = json.id;
        this.json = json;
        this.formatJson();
    }
    // 将json数据格式化为实例数据
    formatJson() {
        this.json.smartData.list.forEach(c => {
            this.nodes.push($getNodeByJson(c));
        });
    }
    templateToString() {
        let result = '';
        this.nodes.forEach(c => {
            result += c.node.toString(2);
        });
        return result;
    }
    toString() {
        let result = 
`
<template>
    <div>
        ${this.templateToString()}
    </div>
</template>

<script>
export default {
    name: 'testName',
    data: () => {
        return {};
    },
    methods: {},
};
</script>

`
;
        return result;
    }
}