const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
require ('dotenv').config({path: '../config.env'});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_monster_killcount')
        .setDescription('Submit a monster killcount for the bingo!')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the data you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('monster')
                .setDescription('The monster you are submitting data for')
                .setRequired(true)
                .addChoices(
                    { name: 'Abyssal Sire', value: 'Abyssal Sire' },
                    { name: 'Alchemical Hydra', value: 'Alchemical Hydra' },
                    { name: 'Barrows Chests', value: 'Barrows Chests' },
                ))
        .addStringOption(option =>
            option.setName('current_value')
                .setDescription('The current killcount for the data you are submitting')
                .setRequired(true)),
    async execute(interaction, client) {
        // Get submission data
        let screenshot = interaction.options.getAttachment('screenshot');
        let current_value = interaction.options.getString('current_value');

        if (current_value === null) {
            current_value = 'N/A';
        }

        // Get submissions channel
        const channel = client.channels.cache.find(channel => channel.name === "data-submissions");

        // Send submission to submissions channel
        const embed = new EmbedBuilder()
            .setTitle(`A player has submitted a monster killcount!`)
            .setDescription(`Current value: ${current_value}`)
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
        interaction.reply(`Your monster killcount has been submitted!`);
    }
};