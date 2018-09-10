const fs = require('fs-extra')

async function generateTransfer(code) {
  const xml = await fs.readFile(`${__dirname}/transfer.xml`, 'utf8')
  return xml.replace('{code}', code)
}

module.exports = generateTransfer
