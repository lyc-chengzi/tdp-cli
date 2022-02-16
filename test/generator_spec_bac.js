import fs from 'node:fs';
import { generatorFactory } from '../lib/generator.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const data1 = require('../data/lyc_test1.json');

function test(){
    const smartData = data1[1].smartData;
    fs.writeFile(`test/test_generator.vue`,
`
<template>
    <div>
        ${loopSmartData(smartData)}
    </div>
</template>

<script>
export default {
    name: 'testName',
    data: () => {
        return {};
    },
    methods: {},
};
</script>
`
    , {encoding: 'utf-8'}, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('写入测试文件成功');
        }
    });
}

function loopSmartData(smartData) {
    const list = smartData.list || [];
    let result = '';
    list.forEach(c => {
        result += generatorFactory(c, 2);
    });
    return result;
}

test();