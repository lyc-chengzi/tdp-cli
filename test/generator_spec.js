import fs from 'node:fs';
import ModelPage from '../lib/model/page.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const data1 = require('../data/lyc_test1.json');

function test(){
    const page = data1[1];
    fs.writeFile(
        `test/test_generator.vue`,
        new ModelPage(page).toString(),
        {encoding: 'utf-8'}, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('写入测试文件成功');
            }
        }
    );
}

test();