const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_minigame')
        .setDescription('Submit a minigame killcount/points for the bingo!')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the minigame you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('minigame')
                .setDescription('The minigame you are submitting data for')
                .setRequired(true)
                .addChoices(
                    { name: 'Barbarian Assault', value: 'Barbarian Assualt' },
                    { name: 'Pest Control', value: 'Pest Control' },
                    { name: 'LMS Wins', value: 'LMS Wins' },
                    { name: 'LMS Kills', value: 'LMS Kills' },
                ))
        .addIntegerOption(option =>
            option.setName('current_value')
                .setDescription('The current killcount/points for the minigame you are submitting')
                .setRequired(true)),
    async execute(interaction, client) {
        let screenshot = interaction.options.getAttachment('screenshot');
        let current_value = interaction.options.getInteger('current_value');
        let minigame = interaction.options.getString('minigame');

        const channel = client.channels.cache.get('1118260344603816047');

        if (!screenshot.url.endsWith('.png') && !screenshot.url.endsWith('.jpg') && !screenshot.url.endsWith('.jpeg')) {
            screenshot.url = "https://cdn-icons-png.flaticon.com/512/6231/6231942.png";
        }

        const embed = new EmbedBuilder()
            .setTitle(`A player has submitted a minigame: ${minigame}`)
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

        interaction.reply(`Your minigame has been submitted!`);
    }
};