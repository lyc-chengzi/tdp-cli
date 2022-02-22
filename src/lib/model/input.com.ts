import { $formatProps } from "../utils.js";
import NodeBase from "./nodeBase.js";

export default class Input extends NodeBase {
    constructor(json: any) {
        super(json);
    }
    toString(level: number) {
        return `<SchemaFormInput ref="${this.key}" ${$formatProps(this.json.col)} />`
    }
    toData() {
        return `
            ${this.key}_data: {
                text: '123',
            },
        `;
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