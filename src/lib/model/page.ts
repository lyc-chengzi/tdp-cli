import { INode } from "../../interface/index.js";
import { $getNodeByJson } from "../utils.js";

// 页面对象
export default class ModelPage {
    id = '';
    json: any = {};
    nodes: INode[] = []; // 虚拟节点
    constructor(json: any) {
        this.id = json.id;
        this.json = json;
        this.formatJson();
    }
    // 将json数据格式化为实例数据
    formatJson() {
        this.json.smartData.list.forEach((c: any) => {
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
    toMixin() {
        let result =
`const mixin = {
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
export default mixin;
`;
        return result;
    }
    toJsFile() {
        let result = 
`import ${this.json.commonPage.label}_mixin from './${this.json.commonPage.label}_mixin';
export default {
    name: '${this.id}',
    mixins: [${this.json.commonPage.label}_mixin],
    created() {},
    mounted() {},
    data: () => {
        return {
            yourData: 666,
        };
    },
    methods: {},
};
`;
        return result;
    }
    toString() {
        let result = 
`<template>
    <div>
        ${this.templateToString()}
    </div>
</template>

<script>
import ${this.json.commonPage.label}_js from './${this.json.commonPage.label}_js';
export default ${this.json.commonPage.label}_js;
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