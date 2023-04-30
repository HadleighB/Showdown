const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of commands'),
    async execute(interaction, client) {
        const commands = client.commands.map(command => command.data.toJSON());

        const embed = new EmbedBuilder()
            .setTitle('Commands')
            .setDescription('A list of all the commands')
            .setColor('#00ff00');

        for (const command of commands) {
            embed.addFields({name: command.name, value: command.description});
        }

        await interaction.reply({embeds: [embed]});

    }
}
