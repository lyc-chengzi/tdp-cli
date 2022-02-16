export default class NodeBase {
    json = {};
    key = '';
    constructor(json) {
        this.key = json.key;
        this.json = json;
    }
    formatJson() {
        
    }
    toString(level) {
        return '';
    }
}