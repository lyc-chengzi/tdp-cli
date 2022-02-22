import fs = require("fs");
import path = require("path");

const nodeType: any = {};

// const nodeType = {
//     [ENodeType.grid](json: Object) {
//         return new Grid(json);
//     },
//     [ENodeType.input](json: Object) {
//         return new Input(json);
//     },
//     [ENodeType.select](json: Object) {
//         return new Select(json);
//     },
//     [ENodeType.button](json: Object) {
//         return new Button(json);
//     },
//     [ENodeType.text](json: Object) {
//         return new Text(json);
//     },
// };

export function $loadDir(dirPath: string) {
    const basePath = __dirname;
    console.log('dir basePath', basePath);
    fs.readdirSync(path.join(basePath, dirPath)).forEach(fileName => {
        if(/\.com.js$/.test(fileName)) {
            const name = path.basename(fileName, '.com.js');
            const node = require(path.join(basePath, dirPath, fileName));
            // console.log('node', node);
            nodeType[name] = function(json: any) {
                return new node.default(json);
            };
        }
    });
    // console.log('nodeType', nodeType);
    return nodeType;
}

$loadDir('.');

export { nodeType };
