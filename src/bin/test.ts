import { program } from "commander";
import cloneProject from "../lib/download.js";
import createPages from "../lib/createPages.js";
const path = require('path');
const data = require('../data/lyc_test.json');
const del = require('del');

program
    .action(async () => {
        const projectName = 'test-generator';
        const _data = {
            appContent: data,
        } as any;
        await del([path.join(process.cwd(), projectName)]);
        cloneProject(projectName, (destPath: string) => {
            // 3. 根据json生成项目代码
            createPages(_data, destPath);
        });
    });
// .requiredOption('-p, --project-name <projectName>', 'the project name');

program.parse(process.argv);
