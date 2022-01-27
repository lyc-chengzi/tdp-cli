import { program } from "commander";
import donwload from './download.js';
program
    .argument('<projectName>', 'created project name')
    .option('-vv, --vue-version <version>', 'choose a vue version', "2")
    .action((projectName) => {
        const options = program.opts();
        donwload(projectName);
    });
    // .requiredOption('-p, --project-name <projectName>', 'the project name');

program.parse(process.argv);
