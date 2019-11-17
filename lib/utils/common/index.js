[
  'logger',
  'spinner',
  'exit',
  'env',
  'request'
].forEach(m => {
  Object.assign(exports, require(`./${m}`))
})