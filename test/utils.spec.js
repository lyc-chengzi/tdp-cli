import { $importFile } from '../lib/utils.js';

async function testImportFile() {
    const modules = $importFile('lib/model');
    console.log('modules', modules);
}

testImportFile();