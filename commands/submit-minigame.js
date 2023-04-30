const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_minigame')
        .setDescription('Submit a minigame killcount/points for the bingo!')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the data you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('minigame')
                .setDescription('The minigame you are submitting data for')
                .setRequired(true)
                .addChoices(
                    { name: 'Barbarian Assault', value: 'Barbarian Assualt' },
                    { name: 'Pest Control', value: 'Pest Control' },
                ))
        .addStringOption(option =>
            option.setName('current_value')
                .setDescription('The current killcount/points for the data you are submitting')
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
            .setTitle(`A player has submitted a minigame!`)
            .setDescription(`Current value: ${current_value}`)
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
        interaction.reply(`Your minigame has been submitted!`);
    }
};