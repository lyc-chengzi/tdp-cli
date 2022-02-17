import { $getNodeByJson } from "../utils.js";

// 页面对象
export default class ModelPage {
    id = '';
    json = {};
    nodes = []; // 虚拟节点
    methods = [];
    dataString = [];
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
    name: '${this.id}',
    created() {
        ${this.toCreated()}
    },
    mounted() {
        ${this.toMounted()}
    },
    data: () => {
        return {
            ${this.toData()}
        };
    },
    methods: {
        ${this.toMethods()}
    },
};
</script>

`
;
        return result;
    }
    toData() {
        let result = '';
        this.nodes.forEach(c => {
            if (c.node && c.node.toData) {
                result += c.node.toData(this);
            }
        });
        return result;
    }
    toMethods() {
        let result = '';
        this.nodes.forEach(c => {
            if (c.node && c.node.toMethods) {
                result += c.node.toMethods(this);
            }
        });
        return result;
    }
    toCreated() {
        let result = '';
        this.nodes.forEach(c => {
            if (c.node && c.node.toCreated) {
                result += c.node.toCreated(this);
            }
        });
        return result;
    }
    toMounted() {
        let result = '';
        this.nodes.forEach(c => {
            if (c.node && c.node.toMounted) {
                result += c.node.toMounted(this);
            }
        });
        return result;
    }
}