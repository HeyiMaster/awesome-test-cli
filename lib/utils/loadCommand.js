module.exports = function loadCommand (commandName, moduleName) {
  const isNotFoundError = err => {
    return err.message.match(/Cannot find module/)
  }
  try {
    return require(moduleName)
  } catch (err) {
    if (isNotFoundError(err)) {
      try {
        return require('import-global')(moduleName)
      } catch (err2) {
        if (isNotFoundError(err2)) {
          const chalk = require('chalk')
          const { hasYarn, hasPnpm3OrLater } = require('../utils/common')
          let installCommand = `npm install -g`
          if (hasYarn()) {
            installCommand = `yarn global add`
          } else if (hasPnpm3OrLater()) {
            installCommand = `pnpm install -g`
          }
          console.log()
          console.log(
            `  命令 ${chalk.cyan(`awesome-test ${commandName}`)} 依赖一些全局的插件\n` +
            `  请执行 ${chalk.cyan(`${installCommand} ${moduleName}`)} 后重试`
          )
          console.log()
          process.exit(1)
        } else {
          throw err2
        }
      }
    } else {
      throw err
    }
  }
}
