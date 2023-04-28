const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require ('dotenv').config({path: '../config.env'});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submit data for the bingo!')
        .addStringOption(option =>
            option.setName('team')
                .setDescription('The team you are submitting for')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the data you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of data you are submitting')
                .setRequired(true)
                .addChoices(
                    { name: 'Item', value: 'item'},
                    { name: 'Minigame', value: 'minigame'},
                    { name: 'Collection Log', value: 'collection_log'},
                    { name: 'Boss Killcount', value: 'boss_killcount'},
                ))    
        .addStringOption(option =>
            option.setName('current_value')
                .setDescription('The current killcount/points for the data you are submitting')
                .setRequired(false)),
    async execute(interaction, client) {
        // Get submission data
        let team = interaction.options.getString('team');
        let screenshot = interaction.options.getAttachment('screenshot');
        let type = interaction.options.getString('type');
        let current_value = interaction.options.getString('current_value');

        if (current_value === null) {
            current_value = 'N/A';
        }

        // Get submissions channel
        const channel = client.channels.cache.find(channel => channel.name === "data-submissions");

        // Send submission to submissions channel
        const embed = new EmbedBuilder()
            .setTitle(`${team} submitted a ${type}!`)
            .setDescription(`Current value: ${current_value}`)
            .setImage(screenshot.url)
            .setURL(screenshot.url)
            .setTimestamp()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setColor('#0099ff');
        channel.send({ embeds: [embed] });

        // Send confirmation to user
        interaction.reply(`Your ${type} has been submitted!`);
    }
};