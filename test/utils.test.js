const utils = require('../lib/utils');
// const Grid = require('../lib/model/grid.com.js').default;
// const grid = new Grid({
//     key: 'grid_sdfsdf',
//     type: 'grid3',
//     columns: [{
//         list: [
//             {
//                 key: 'title_dddd',
//                 type: 'title',
//             }
//         ],
//     }],
// });
// console.log(grid);

const testProps = {
    "card-height": {
        "associateVal": [
            "1"
        ],
        "label": "common.height",
        "type": "numberpicker",
        "value": "120",
        "associate": "card-height-auto",
        "group": "basic"
    },
    "border-radius": {
        "default": 0,
        "min": 0,
        "max": 20,
        "label": "right.attribute.borderRadius",
        "type": "sliderpicker",
        "suffix": "px",
        "value": 0,
        "group": "border"
    },
    "margin-padding": {
        "default": "",
        "label": "边距",
        "type": "boxModel",
        "value": {
            "padding": [
                0,
                "0",
                0,
                0
            ],
            "margin": [
                0,
                "0",
                0,
                "0"
            ]
        },
        "group": "box-model"
    },
    "shadow": {
        "label": "common.shadow",
        "type": "boolean",
        "value": false,
        "group": "basic"
    },
    "card-height-auto": {
        "options": [
            {
                "label": "right.attribute.custom",
                "value": "1"
            },
            {
                "label": "right.attribute.auto",
                "value": "2"
            }
        ],
        "label": "common.heightSet",
        "type": "select",
        "value": "2",
        "group": "basic"
    },
    "apiBasic": {},
    "apiData": "{}",
    "$click": [
        {a: 'a'}
    ],
};

test("测试 $formatProps 1 -> ", () => {
    const propsString = utils.$formatProps(testProps);
    const equal = propsString.indexOf('apiBasic') < 0
    expect(equal).toBe(true);
});

test("测试 $formatProps 2 -> ", () => {
    const propsString = utils.$formatProps(testProps);
    const equal = propsString.indexOf('apiData') < 0
    expect(equal).toBe(true);
});

test("测试 $formatProps 3 -> ", () => {
    const propsString = utils.$formatProps(testProps);
    const equal = propsString.indexOf('$click') < 0
    expect(equal).toBe(true);
});