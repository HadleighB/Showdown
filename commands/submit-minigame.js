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
                ))
        .addIntegerOption(option =>
            option.setName('current_value')
                .setDescription('The current killcount/points for the minigame you are submitting')
                .setRequired(true)),
    async execute(interaction, client) {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            let screenshot = interaction.options.getAttachment('screenshot');
            let current_value = interaction.options.getInteger('current_value');
            let minigame = interaction.options.getString('minigame');

            const channel = client.channels.cache.find(channel => channel.name === "data-submissions");

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
    }
};