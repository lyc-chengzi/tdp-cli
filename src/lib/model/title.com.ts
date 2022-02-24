import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Title extends NodeBase {
    constructor(json: any) {
        super(json);
    }
    toString(level?: number) {
        return `<SchemaFormTitle ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
}