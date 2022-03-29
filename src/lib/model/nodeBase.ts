import classNames from 'classnames';
import { $getComponentNameByType, $printLevelSpace, $formatProps, $formatEvents } from '../utils.js';
import Page from './page.js';

const eventNames = ['$click'];

export default class NodeBase {
    json: any = {}; // 组件的原始json配置
    key = ''; // 组件key
    hasProps = false; // 是否有用户设置的属性
    hasApi = false; // 组件是否配置了接口
    hasEvents = false; // 组件是否配置了事件
    tag = 'div';
    constructor(json: any) {
        this.key = json.key.replace('-', '_');
        this.json = json;
        this._formatJson();
    }
    _formatJson() {
        this.tag = $getComponentNameByType(this.json.type, this.json.group) || 'div';
        if (this.json.col && Object.keys(this.json.col).length) {
            this.hasProps = true;
        }
        if (this.json.col && this.json.col.apiBasic && JSON.stringify(this.json.col.apiBasic) !== '{}') {
            this.hasApi = true;
        }
        if (this.json.col && Object.keys(this.json.col).some(c => eventNames.some(e => e === c))) {
            this.hasEvents = true;
        }
    }
    toString(level: number) {
        const s1 = $printLevelSpace(level);
        const s2 = $printLevelSpace(level + 1);
        const itemTag = this.json.group === 'smart-chart' ? 've-chart-item' : 'schema-form-item';
        // 拼写ref、class、组合属性
        let result = `
${s1}<${itemTag}
${s2}ref="${this.key}"
${s2}class="tdp-generator-${classNames(this.json.type)}"
${s2}:col="${this.key}_data"
${s2}:edit="false"
${s2}:model="{}"`;
        if(Object.prototype.hasOwnProperty.call(this.json.col, 'select-options')){
            result += `
${s2}:options="${this.key}_data.attrs['select-options']"`;
        } else {
            result += `
${s2}:options="[]"`;
        }
        // 如果有接口请求，拼写接口请求
        if (this.hasApi) {
            result += `
${s2}:apiBasic="${this.key}_apiBasic"
${s2}:apiData="${this.key}_apiData"`;
        } else {
            result += `
${s2}:apiBasic="{}"`;
        }

        // 拼写组件结束标签
        result += `
${s1}>
${s1}</${itemTag}>`;
// ${s2}<${this.tag}></${this.tag}>

        return result;
    }
    // 向data中写入代码
    toData(pageInstance: Page): string {
        let result = '';
        const apiItemize = this.json.apiItemize ? `'${this.json.apiItemize}'` : undefined; 
        result += `
            ${this.key}_data: {
                type: '${this.json.type}',
                apiItemize: ${apiItemize},
                attrs: {
                    type: '${this.json.type}',${$formatProps(this.json.col)}
                },
                formItem: {label: '${this.json.label}'},
                on: ${JSON.stringify($formatEvents(this.json.col), null, 4)},
                prop: '${this.key}',
                ref: '${this.key}',
            },`;
        if (this.hasApi) {
            result += `
            ${this.key}_apiBasic: ${JSON.stringify(this.json.col.apiBasic, null, 4)},
            ${this.key}_apiData: {},
            `;
        }
        return result;
    }
    // 向methods中写入代码
    toMethods(pageInstance: Page) {
        let result = '';
        if(this.hasApi) {
            const apiBasic = this.json.col.apiBasic || {};
            result += `
        ${this.key}_api: function() {
            // fetch api
            axios({
                method: '${apiBasic.apiMethod}',
                url: '${apiBasic.apiuri}',
            })
                .then(data => {
                    console.log('${this.key} data ---->', data);
                }).catch(e => {

                });
        },`;
        }
        // return result;
        return '';
    }
    // 向mounted中写入代码
    toMounted(pageInstance: Page) {
        let result = '';
        if(this.hasApi) {
            result += `
        this.${this.key}_api();`;
        }
        // return result;
        return '';
    }
}