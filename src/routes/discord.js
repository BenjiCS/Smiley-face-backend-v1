const router = require("express").Router();
const { getBotGuilds, getGuildRoles, getUserGuilds } = require("../utils/api");
const User = require("../database/schemas/User");
const { getMutualGuilds } = require("../utils/utils");
const GuildConfig = require("../database/schemas/GuildConfig");

router.get("/guilds", async (req, res) => {
  const guilds = await getBotGuilds();
  const user = await User.findOne({ discordId: req.user.discordId });
  console.log(user)
  if (req.user) {
    const userGuilds = await getUserGuilds(req.user.discordId);
    const mutualGuilds = getMutualGuilds(userGuilds, guilds);
    res.send(mutualGuilds);
  } else {
    return res.status(401).send({ msg: "Unauthorized" });
  }
});

router.put("/guilds/:guildId/prefix", async (req, res) => {
  const { prefix } = req.body;
  const { guildId } = req.params;
  if (!prefix) return res.status(400).send({ msg: "Prefix Required" });
  const update = await GuildConfig.findOneAndUpdate(
    { guildId },
    { prefix },
    { new: true }
  );
  return update
    ? res.send(update)
    : res.status(400).send({ msg: "Could not find document" });
});

router.get("/guilds/:guildId/config", async (req, res) => {
  const { guildId } = req.params;
  const config = await GuildConfig.findOne({ guildId });
  return config ? res.send(config) : res.status(404).send({ msg: "Not found" });
});

router.get("/guilds/:guildId/roles", async (req, res) => {
  const { guildId } = req.params;
  try {
    const roles = await getGuildRoles(guildId);
    res.send(roles);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

router.put("/guilds/:guildId/roles/default", async (req, res) => {
  const { defaultRole } = req.body;
  if (!defaultRole) return res.status(400).send({ msg: "Bad Request" });
  const { guildId } = req.params;
  try {
    const update = await GuildConfig.findOneAndUpdate(
      { guildId },
      { defaultRole },
      { new: true }
    );
    return update
      ? res.send(update)
      : res.status(400).send({ msg: "Bad Request" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = router;
