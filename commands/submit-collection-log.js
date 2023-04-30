const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_collection_log')
        .setDescription('Submit a collection log item for the bingo!')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the data you are submitting')
                .setRequired(true)),
    async execute(interaction, client) {
        // Get submission data
        let screenshot = interaction.options.getAttachment('screenshot');
        let item = interaction.options.getString('item');

        // Get submissions channel
        const channel = client.channels.cache.find(channel => channel.name === "data-submissions");

        // Send submission to submissions channel
        const embed = new EmbedBuilder()
            .setTitle(`A player has submitted a collection log item!`)
            .setImage(screenshot.url)
            .setURL(screenshot.url)
            .setTimestamp()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setColor('#0099ff');

        // Accept and deny buttons
        const approveButton = new ButtonBuilder()
            .setCustomId('approve')
            .setLabel('Approve')
            .setStyle(ButtonStyle.Success);

        const denyButton = new ButtonBuilder()
            .setCustomId('deny')
            .setLabel('Deny')
            .setStyle(ButtonStyle.Danger);

        const actionRow = new ActionRowBuilder()
            .addComponents(approveButton, denyButton);

        
        channel.send({ embeds: [embed], components: [actionRow] });

        // Send confirmation to user
        interaction.reply(`Your collection log item has been submitted!`);
    }
};