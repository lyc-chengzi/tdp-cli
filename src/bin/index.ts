#!/usr/bin/env node
import { program } from "commander";
import chalk = require("chalk");
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const version = pkg.version;

console.log(chalk.rgb(231, 180, 182).underline('😄 thanks for use tdp-cli !'));
program
    .version(version)
    .name('tdp')
    .usage('<command> [options]');

// create
program
    .command('create <name>', 'create a tdp-vue project', {
        executableFile: 'create.js'
    });

program.parse(process.argv);