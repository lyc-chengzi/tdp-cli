import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Button extends NodeBase {
    constructor(json) {
        super(json);
    }
    toString(level) {
        return `<SchemaFormButton ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
}