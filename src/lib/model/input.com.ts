import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Input extends NodeBase {
    constructor(json: any) {
        super(json);
    }
    toString(level: number) {
        return `<SchemaFormInput ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
}