import Page from './page.js';
export default class NodeBase {
    json: any = {};
    key = '';
    constructor(json: any) {
        this.key = json.key;
        this.json = json;
    }
    formatJson() {
        
    }
    toString(level: number) {
        return '';
    }
    // 向data中写入代码
    toData(pageInstance: Page): string {
        let result = '';
        if (this.json.col.$click) {
            result += `
            ${this.key}_events: {
                $click: [
                    {
                        "checkAction": "router",
                        "routerPage": "Page-xWZ91638951062318"
                    }
                ],
            }
            `;
        }
        return result;
    }
    // 向methods中写入代码
    toMethods(pageInstance: Page) {
        let result = '';
        if(this.json.apiBasic) {
            result += `
            ${this.key}_api() {
                // fetch api
                console.log('${this.key} fetch method');
            },
        `;
        }
        return result;
    }
    // 向mounted中写入代码
    toMounted(pageInstance: Page) {
        let result = '';
        if(this.json.apiBasic) {
            result += `
            this.${this.key}_api();
            `;
        }
        return result;
    }
}