import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Button extends NodeBase {
    constructor(json: any) {
        super(json);
    }
    toString(level?: number) {
        return `<SchemaFormButton ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
    toMethods() {
        return `
        ${this.key}_api() {
            // fetch api
            console.log('${this.key} fetch method');
        },
        `;
    }
    toMounted() {
        return `
        this.${this.key}_api();
        `;
    }
}