const synchronizeSlashCommands = require('../modules/sync_commands.js');
const { ActivityType } = require('discord.js');
const dotenv = require('dotenv').config({path: 'config.env'});
module.exports = {
  name: 'ready',
  async execute(client) {
    console.log(`Connected as ${client.user.username}`)

    await synchronizeSlashCommands(client,
      client.commands.map((c) => c.data),
      {
        debug: true,
        guildId: process.env.GUILD_ID,
      }
    )
}}