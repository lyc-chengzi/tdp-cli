import { INode } from "../../interface/index.js";
import { $getNodeByJson, $getPageName } from "../utils.js";
import Grid from "./grid.com.js";

// 页面对象
export default class ModelPage {
    id = '';
    json: any = {};
    originName: string = ''; // 原始name，用于给用户提示
    pageName: string = ''; // 处理过的name，用于文件名
    hasSmartData = false;
    smartNodes: INode<Grid>[] = []; // content虚拟节点
    hasHeaderData = false;
    headerNodes: INode[] = []; // header虚拟节点
    hasAsideData = false;
    asideNodes: INode[] = []; // aside虚拟节点
    constructor(json: any) {
        this.id = json.id;
        this.json = json;
        this.formatJson();
    }
    // 将json数据格式化为实例数据
    formatJson() {
        this.originName = this.json && this.json.commonPage && this.json.commonPage.label || '';
        this.pageName = $getPageName(this.originName);

        // 判断是否有header
        if (this.json.headerData && this.json.headerData.list && this.json.headerData.list.length) {
            this.hasHeaderData = true;
            this.json.headerData.list.forEach((c: any) => {
                this.headerNodes.push($getNodeByJson(c));
            });
        }

        // 判断是否有左侧
        if (this.json.asideData && this.json.asideData.list && this.json.asideData.list.length) {
            this.hasAsideData = true;
            this.json.asideData.list.forEach((c: any) => {
                this.asideNodes.push($getNodeByJson(c));
            });
        }

        // 判断是否有内容
        if (this.json.smartData && this.json.smartData.list && this.json.smartData.list.length) {
            this.hasSmartData = true;
            this.json.smartData.list.forEach((c: any) => {
                this.smartNodes.push($getNodeByJson(c) as INode<Grid>);
            });
        }        
    }
    // 向template写内容
    templateToString() {
        const renderAsideData = () => {
            let result = '';
            if (this.hasAsideData) {
                result += `
                <div class="Baside aside">`;
                this.asideNodes.forEach(c => {
                    result += c.node.toString(5);
                });
                result += `
                </div>`;
            }
            return result;
        };

        const renderSmartData = () => {
            let result = '';
            if (this.hasSmartData) {
                this.smartNodes.forEach(c => {
                    result += c.node.toString(4);
                });
            }
            return result;
        };

        let result = '';
        // 判断是否展示头部
        if (this.hasHeaderData) {
            result += `
        <div
            class="Bheader header"
            ref="header"
            :style="{
                background: currentContainer.header.background,
                ...deviceWidth,
            }"
        >
        </div>`;
        }

        result += `
        <div
            class="content"
            :style="{
                height: 'calc(100% - 64px)',
            }"
        >
            ${renderAsideData()}
            <div class="Bmain main" id="ui_editor_main">
                ${renderSmartData()}
            </div>
        </div>`;   
        return result;
    }

    // 写page对应的mixin文件
    toMixin() {
        let result =
`// ${this.originName}
import axios from 'axios';
import { mapGetters } from 'vuex';
const mixin = {
    created() {
        ${this.toCreated()}
    },
    mounted() {
        ${this.toMounted()}
    },
    computed: {
        ...mapGetters('commonController', ['appId']),
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

    // 写page对应的script文件
    toScriptFile() {
        let result = 
`import ${this.pageName}_mixin from '../mixins/${this.pageName}_mixin';
export default {
    name: '${this.id}',
    pageName: '${this.originName}',
    mixins: [${this.pageName}_mixin],
    provide() {
        return {
            setChildrenRef: (name, ref) => {
                this[name] = ref;
            },
            getChildrenRef: name => {
                return this[name];
            },
            getRef: () => {
                return this;
            },
        };
    },
    created() {
        this.yourMethod();
    },
    mounted() {},
    data: () => {
        return {
            yourData: 1,
        };
    },
    methods: {
        yourMethord() {
            this.yourData = 2;
        },
    },
};
`;
        return result;
    }

    // 写page对应的vue文件
    toString() {
        let result = 
`<!-- ${this.originName} -->
<template>
    <div class="${this.id}">
        ${this.templateToString()}
    </div>
</template>

<script>
// ${this.originName}
import ${this.pageName}_script from './scripts/${this.pageName}_script';
export default ${this.pageName}_script;
</script>

`
;
        return result;
    }

    // 写page的data
    toData() {
        let result = '';
        this.smartNodes.forEach(c => {
            if (c.node && c.node.toData) {
                result += c.node.toData(this);
            }
        });
        return result;
    }

    // 写page的method
    toMethods() {
        let result = '';
        this.smartNodes.forEach(c => {
            if (c.node && c.node.toMethods) {
                result += c.node.toMethods(this);
            }
        });
        return result;
    }

    // 写page的created
    toCreated() {
        let result = '';
        this.smartNodes.forEach(c => {
            if (c.node && c.node.toCreated) {
                result += c.node.toCreated(this);
            }
        });
        return result;
    }

    // 写page的mounted
    toMounted() {
        let result = '';
        this.smartNodes.forEach(c => {
            if (c.node && c.node.toMounted) {
                result += c.node.toMounted(this);
            }
        });
        return result;
    }
}