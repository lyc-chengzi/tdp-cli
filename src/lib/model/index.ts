import Page from './page.js';
import Grid from "./grid.js";
import Input from "./input.js";
import Select from "./select.js";
import Button from "./button.js";
import Text from './text.js';
import { ENodeType } from "../enum/index.js";

export default {
    Page,
    Grid,
    Input,
    Select,
    Button,
    Text
};

const nodeType = {
    [ENodeType.grid](json: Object) {
        return new Grid(json);
    },
    [ENodeType.input](json: Object) {
        return new Input(json);
    },
    [ENodeType.select](json: Object) {
        return new Select(json);
    },
    [ENodeType.button](json: Object) {
        return new Button(json);
    },
    [ENodeType.text](json: Object) {
        return new Text(json);
    },
};

export { nodeType };