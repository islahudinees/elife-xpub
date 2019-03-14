const config = require('config')
const { User } = require('@elifesciences/xpub-model')
const { Manuscript } = require('@elifesciences/xpub-controller')

async function updateManuscript(_, { data }, { user }) {
  const userUuid = await User.getUuidForProfile(user)
  const ms = new Manuscript(config, userUuid)
  console.log('============')
  console.log(data)
  console.log('============')
  return ms.update(data)
}

module.exports = updateManuscript
