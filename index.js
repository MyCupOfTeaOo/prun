const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
console.log(process.argv);
const inputPath = process.argv.reverse().find(arg => /[\/.]/.test(arg));
const cwd = path.resolve(inputPath);
const jsonPath = `${cwd}\\package.json`;

console.info(jsonPath);
function main() {
  const has = fs.existsSync(jsonPath);
  if (!has) {
    console.error("没有在该路径下找到 package.json 文件,路径:", jsonPath);
    return;
  }
  const json = JSON.parse(fs.readFileSync(jsonPath));
  const scripts = json.scripts;
  if (!scripts) {
    console.error("package.json里没有scripts脚本");
    return;
  }
  const keys = Object.keys(scripts);
  if (keys.length < 1) {
    console.error("scripts脚本为空");
    return;
  }
  inquirer
    .prompt([
      {
        type: "list",
        name: "script",
        message: "What do you want to run script?",
        choices: keys.map(script => ({
          name: script
        }))
      }
    ])
    .then(answers => {
      const ls = child_process.spawn(
        process.platform === "win32" ? "npm.cmd" : "npm",
        ["run", answers.script],
        { cwd }
      );
      ls.stdout.on("data", data => {
        console.info(data.toString());
      });
      ls.stderr.on("data", data => {
        console.error(data.toString());
      });
    });
}
main();
