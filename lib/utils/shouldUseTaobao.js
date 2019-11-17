const chalk = require('chalk')
const execa = require('execa')
const { hasYarn, request } = require('./common')
const inquirer = require('inquirer')
const registries = require('./registries')

async function ping (registry) {
  await request.get(`${registry}/react/latest`)
  return registry
}


let checked
let result

module.exports = async function shouldUseTaobao (command) {
  if (!command) {
    command = hasYarn() ? 'yarn' : 'npm'
  }

  // ensure this only gets called once.
  if (checked) return result
  checked = true

  const save = val => {
    result = val
    return val
  }

  const userCurrentRegistry = (await execa(command, ['config', 'get', 'registry'])).stdout
  // const defaultRegistry = registries[command]

  let faster
  try {
    faster = await Promise.race([
      ping(userCurrentRegistry),
      ping(registries.taobao)
    ])
  } catch (e) {
    return save(false)
  }
  if (faster !== registries.taobao) {
    // 默认镜像更快，不用淘宝镜像
    return save(false)
  }

  // 询问源的选择
  const { useTaobaoRegistry } = await inquirer.prompt([
    {
      name: 'useTaobaoRegistry',
      type: 'confirm',
      message: chalk.yellow(
        ` Your connection to the default ${command} registry seems to be slow.\n` +
          `   Use ${chalk.cyan(registries.taobao)} for faster installation?`
      )
    }
  ])
  return save(useTaobaoRegistry)
}
