const CryptoJS = require("crypto-js");
const config = require("../../config");

function getMutualGuilds(userGuilds, botGuilds) {
  const validGuilds = userGuilds.filter(
    (guild) => (guild.permissions & 0x20) === 0x20
  );
  const included = [];
  const excluded = validGuilds.filter((guild) => {
    const findGuild = botGuilds.find((g) => g.id === guild.id);
    if (!findGuild) return guild;
    included.push(findGuild);
  });
  return { excluded, included };
}

function encrypt(token) {
  return CryptoJS.AES.encrypt(token, config.SECRET_PASSPHRASE);
}

function decrypt(token) {
  return CryptoJS.AES.decrypt(token, config.SECRET_PASSPHRASE);
}

module.exports = { getMutualGuilds, encrypt, decrypt };
