#!/usr/bin/env node

// 检测node版本相关依赖
const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

// 检测node版本函数
/**
 * 
 * @param {*} wanted 
 * @param {*} id 
 */
function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      '你是用的Node版本号为： ' + process.version + ', 但 ' + id +
      ' 需运行在 ' + wanted + '.\n请升级你的Node版本'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'awesome-test-cli')

if (semver.satisfies(process.version, '9.x')) {
  console.log(chalk.red(
    `你是用的Node版本是 ${process.version}.\n` +
    `强烈建议你使用最新 LTS 版本`
  ))
}

// 开始处理命令
const program = require('commander')
const minimist = require('minimist')

program
  .version(require('../package').version)
  .usage('<command> [options]')

// 创建命令
program
  .command('create <app-name>')
  .description('create a new project')
  .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
  .option('-d, --default', 'Skip prompts and use default preset')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n ⚠️  检测到您输入了多个名称，将以第一个参数为项目名，舍弃后续参数哦'))
    }
    require('../lib/create')(name, options)
  })

// 创建页面命令
program
  .command('page <page-name>')
  .description('create a new page')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/page')(name, options)
  })

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
    // suggestCommands(cmd)
  })


// 自定义错误提示信息
const enhanceErrorMessages = require('../lib/utils/enhanceErrorMessages')
// 缺少参数的错误提示
enhanceErrorMessages('missingArgument', argName => {
  return `缺少必要参数 ${chalk.yellow(`<${argName}>`)}.`
})

// 调用
program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// 获取参数
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // 如果没有传递option或者有与之相同的命令，则不被拷贝
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}