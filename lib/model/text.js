import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Text extends NodeBase {
    constructor(json) {
        super(json);
    }
    toString(level) {
        return `<SchemaFormText ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
}