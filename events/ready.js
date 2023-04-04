const synchronizeSlashCommands = require('../modules/sync_commands.js')
const { ActivityType } = require('discord.js')
module.exports = {
  name: 'ready',
  async execute(client) {
    console.log(`Connected as ${client.user.username}`)
    client.user.setActivity(`you for quite a while now.`, { type: ActivityType.Watching })

    await synchronizeSlashCommands(client,
      client.commands.map((c) => c.data),
      {
        debug: true,
        guildId: "767870116313432124"
      }
    )
}}