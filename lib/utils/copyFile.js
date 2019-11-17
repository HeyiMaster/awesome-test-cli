const fs = require('fs-extra')
const path = require('path')

module.exports = async function copyFile (temp, target) {
  await fs.copy(temp, target)
  await fs.remove(path.resolve(target, './.git'))
  const pkgJson = await fs.readJson(target+'/package.json')
  return pkgJson
}