#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
require("colors");

const inputPath =
  process.argv.slice(2, process.argv.length).find(arg => /[\/.]/.test(arg)) ||
  "./";
const cwd = path.resolve(inputPath);
const jsonPath = `${cwd}\\package.json`;

console.info(jsonPath);

function gen_space(str) {
  return Array(str.length < 20 ? 24 - str.length : 4).join(" ") + " ";
}

function main() {
  const has = fs.existsSync(jsonPath);
  if (!has) {
    console.error(
      "没有在该路径下找到 package.json 文件,路径:".red,
      jsonPath.red
    );
    return;
  }
  const json = JSON.parse(fs.readFileSync(jsonPath));
  const scripts = json.scripts;
  if (!scripts) {
    console.error("package.json里没有scripts脚本".red);
    return;
  }
  const keys = Object.keys(scripts);
  if (keys.length < 1) {
    console.error("scripts脚本为空".red);
    return;
  }

  inquirer
    .prompt([
      {
        type: "list",
        name: "script",
        message: "What do you want to run script?",
        choices: keys.map(script => ({
          name: `${script}${gen_space(script)}${scripts[script]}`,
          value: script
        }))
      }
    ])
    .then(answers => {
      console.log(answers);
      child_process.spawn(
        process.platform === "win32" ? "npm.cmd" : "npm",
        ["run", answers.script],
        { cwd, stdio: "inherit" }
      );
    });
}

if (require.main === module) {
  main();
}

module.exports = main;
