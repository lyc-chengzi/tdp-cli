import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";
import page from "./page.js";

export default class Button extends NodeBase {
    constructor(json: any) {
        super(json);
    }
    toString(level?: number) {
        return `<SchemaFormButton ref="${this.key}" ${$formatProps(this.json.col)} :on-events="${this.key}_events"/>`
    }
}