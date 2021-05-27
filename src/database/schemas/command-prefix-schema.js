const mongoose = require('mongoose')

const commandPrefixSchema = mongoose.Schema({
  // Guild ID
  guildId: {
    type: String,
    required: true,
  },

  prefix: {
    type: String,
    required: true,
    default: "!",
  },
})

module.exports = mongoose.model('guild-prefixes', commandPrefixSchema)
