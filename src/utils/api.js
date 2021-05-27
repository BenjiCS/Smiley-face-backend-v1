const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const OAuth2Credentials = require("../database/schemas/OAuth2Credentials");
const { decrypt } = require("../utils/utils");
const config = require("../../config");

// const TOKEN = process.env.DASHBOARD_BOT_TOKEN;
const TOKEN = config.DASHBOARD_BOT_TOKEN;

const DISCORD_API = "http://discord.com/api/v6";

async function getBotGuilds() {
  const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    method: "GET",
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });
  return response.json();
}

async function getGuildRoles(guildId) {
  const response = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
    method: "GET",
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });
  return response.json();
}

async function getUserGuilds(discordId) {
  const credentials = await OAuth2Credentials.findOne({ discordId });
  if (!credentials) throw new Error("No credentials.");
  const encryptedAccessToken = credentials.get("accessToken")
  const decrypted = decrypt(encryptedAccessToken)
  const accessToken = decrypted.toString(CryptoJS.enc.Utf8)
  const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

module.exports = { getBotGuilds, getGuildRoles, getUserGuilds };
