import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Text extends NodeBase {
    constructor(json: any) {
        super(json);
    }
    toString(level: number) {
        return `<SchemaFormText ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
}