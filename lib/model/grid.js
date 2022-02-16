import { $printLevelSpace, $getNodeByJson } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Grid extends NodeBase {
    columns = [];
    constructor(json) {
        super(json);
        this.formatJson();
    }
    formatJson() {
        this.columns = this.json.columns.map(c => {
            return {
                span: c.span,
                nodes: c.list.map(_c => $getNodeByJson(_c)),
            };
        });
    }
    toString(level) {
        let result = '';
        // 组织grid组件结构
        result = 
 `
${$printLevelSpace(level)}<v-container>
${$printLevelSpace(level + 1)}<v-row no-gutters>
${$printLevelSpace(level + 2)}${this.loopCol(level + 2)}
${$printLevelSpace(level + 1)}</v-row>
${$printLevelSpace(level)}</v-container>
`;
        return result;
    }

    // 循环column
    loopCol(level) {
        let _result = '';
        this.columns.forEach(c => {
            _result += 
`
${$printLevelSpace(level)}<v-col span="${c.span}">
${$printLevelSpace(level + 1)}${this.loopNodes(c.nodes, level + 1)}
${$printLevelSpace(level)}</v-col>
`
        });
        return _result;
    };

    // 循环column中的子组件
    loopNodes(nodes, level) {
        let _result = '';
        nodes.forEach(node => {
            _result += 
`
${$printLevelSpace(level)}${node.node.toString(level)}
`;
        });
        return _result;
    };
}