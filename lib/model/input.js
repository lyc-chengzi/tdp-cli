import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Input extends NodeBase {
    constructor(json) {
        super(json);
    }
    toString(level) {
        return `<SchemaFormInput ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
}