const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
require ('dotenv').config({path: '../config.env'});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_collection_log')
        .setDescription('Submit a collection log item for the bingo!')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the data you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('item')
                .setDescription('The item you are submitting')
                .setRequired(true)
                .addChoices(
                    {name: 'Abyssal Whip', value: 'Abyssal Whip'},
                    {name: 'Abyssal Dagger', value: 'Abyssal Dagger'},
                    {name: 'Abyssal Head', value: 'Abyssal Head'},
                    {name: 'Abyssal Orphan', value: 'Abyssal Orphan'},
                )),
    async execute(interaction, client) {
        // Get submission data
        let screenshot = interaction.options.getAttachment('screenshot');
        let item = interaction.options.getString('item');

        // Get submissions channel
        const channel = client.channels.cache.find(channel => channel.name === "data-submissions");

        // Send submission to submissions channel
        const embed = new EmbedBuilder()
            .setTitle(`A player has submitted a ${item}!`)
            .setImage(screenshot.url)
            .setURL(screenshot.url)
            .setTimestamp()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setColor('#0099ff');

        // Accept and deny buttons
        const acceptButton = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success);

        const denyButton = new ButtonBuilder()
            .setCustomId('deny')
            .setLabel('Deny')
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder()
            .addComponents(acceptButton, denyButton);

        
        channel.send({ embeds: [embed], components: [actionRow] });

        // Send confirmation to user
        interaction.reply(`Your ${item} has been submitted!`);
    }
};