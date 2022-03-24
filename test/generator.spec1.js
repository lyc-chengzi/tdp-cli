const fs = require('fs');
const ModelPage = require('../lib/model/page.js');
const data1 = require('../data/lyc_test.json');

function test(){
    const page = data1[1];
    fs.writeFile(
        `test/test_generator.vue`,
        new ModelPage.default(page).toString(),
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