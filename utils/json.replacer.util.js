function jsonReplacer (key, value) {
  const excludes = ['password', '_raw', '_json', '__v']

  return excludes.includes(key) ? undefined : value
}

module.exports = { jsonReplacer }
