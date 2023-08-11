const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_farming')
        .setDescription('Submit a tithe points/farming contracts for the bingo!')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the minigame you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('farming_type')
                .setDescription('The type of data you are submitting')
                .setRequired(true)
                .addChoices(
                    { name: 'Tithe Farm', value: 'Tithe Farm' },
                    { name: 'Farming Contracts', value: 'Farming Contracts' },
                ))
        .addIntegerOption(option =>
            option.setName('current_value')
                .setDescription('The contracts/points for the type of farming you are submitting')
                .setRequired(true)),
    async execute(interaction, client) {
        let screenshot = interaction.options.getAttachment('screenshot');
        let current_value = interaction.options.getInteger('current_value');
        let farming_type = interaction.options.getString('farming_type');

        const channel = client.channels.cache.get('1118260344603816047');

        if (!screenshot.url.endsWith('.png') && !screenshot.url.endsWith('.jpg') && !screenshot.url.endsWith('.jpeg')) {
            screenshot.url = "https://cdn-icons-png.flaticon.com/512/6231/6231942.png";
        }

        const embed = new EmbedBuilder()
            .setTitle(`A player has submitted contracts/points: ${farming_type}`)
            .setDescription(`Current value: ${current_value}`)
            .setImage(screenshot.url)
            .setURL(screenshot.url)
            .setTimestamp()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setColor('#0099ff');

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

        interaction.reply({ embeds: [embed] });
    }
};