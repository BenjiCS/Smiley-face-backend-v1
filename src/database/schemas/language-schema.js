const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const languageSchema = mongoose.Schema({
  // Guild ID
  guildId: reqString,
  language: reqString,
})

module.exports = mongoose.model('languages', languageSchema)
