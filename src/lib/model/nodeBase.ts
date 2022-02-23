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
    toData() {
        return '';
    }
    // 向methods中写入代码
    toMethods() {
        return '';
    }
    // 向mounted中写入代码
    toMounted() {
        return '';
    }
}