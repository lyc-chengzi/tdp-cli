import classNames from 'classnames';
import { $getComponentNameByType, $printLevelSpace, $formatProps } from '../utils.js';
import Page from './page.js';

const eventNames = ['$click'];

export default class NodeBase {
    json: any = {}; // 组件的原始json配置
    key = ''; // 组件key
    hasApi = false; // 组件是否配置了接口
    hasEvents = false; // 组件是否配置了事件
    tag = 'div';
    constructor(json: any) {
        this.key = json.key.replace('-', '_');
        this.json = json;
        this._formatJson();
    }
    _formatJson() {
        this.tag = $getComponentNameByType(this.json.type) || 'div';
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
        // 拼写ref、class、组合属性
        let result = `
${s1}<${this.tag}
${s2}ref="${this.key}"
${s2}class="${classNames(this.json.type)}"
${s2}v-bind="${this.key}_attrs"`;

        // 如果有接口请求，拼写接口请求
        if (this.hasApi) {
            result += `
${s2}:apiData="${this.key}_apiData"`;
        }

        // 如果有事件，拼写事件
        if (this.hasEvents) {
            result += `
${s2}:onEvents="${this.key}_events"`;
        }

        // 拼写组件结束标签
        result += `
${s1}>
${s1}</${this.tag}>`;

        return result;
    }
    // 向data中写入代码
    toData(pageInstance: Page): string {
        let result = '';
        result += `
            '${this.key}_attrs': {
                ${$formatProps(this.json.col)}
            },`;
        if (this.hasEvents) {
            result += `
            '${this.key}_events': {
                click: [
                    {
                        "checkAction": "router",
                        "routerPage": "Page-xWZ91638951062318"
                    }
                ],
            },`;
        }
        if (this.hasApi) {
            result += `
            '${this.key}_apiData': {},`;
        }
        return result;
    }
    // 向methods中写入代码
    toMethods(pageInstance: Page) {
        let result = '';
        if(this.hasApi) {
            const apiBasic = this.json.col.apiBasic || {};
            result += `
        '${this.key}_api': function() {
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
        return result;
    }
    // 向mounted中写入代码
    toMounted(pageInstance: Page) {
        let result = '';
        if(this.hasApi) {
            result += `
        this['${this.key}_api']();`;
        }
        return result;
    }
}