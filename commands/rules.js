const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Displays the rules of the server'),
    async execute(interaction) {
        let eventRulesChannel = interaction.guild.channels.cache.get("970450134590705724");
        let serverRulesChannel = interaction.guild.channels.cache.get("784314398339629117");

        await interaction.reply(`Please read the rules in ${eventRulesChannel} and ${serverRulesChannel}`);
    }
};