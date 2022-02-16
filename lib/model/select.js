import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Select extends NodeBase {
    constructor(json) {
        super(json);
    }
    toString(level) {
        return `<SchemaFormSelect ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
}