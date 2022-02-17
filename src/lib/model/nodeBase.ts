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
}