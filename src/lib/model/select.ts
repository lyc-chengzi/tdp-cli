import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Select extends NodeBase {
    constructor(json: any) {
        super(json);
    }
    toString(level: number) {
        return `<SchemaFormSelect ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
}