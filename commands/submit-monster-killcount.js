const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

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
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('current_value')
                .setDescription('The current killcount for the data you are submitting')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction, client) {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            let screenshot = interaction.options.getAttachment('screenshot');
            let monster = interaction.options.getString('monster');
            let current_value = interaction.options.getInteger('current_value');

            if (current_value === null) {
                current_value = 'N/A';
            }

            const channel = client.channels.cache.get('1118260344603816047');

            const embed = new EmbedBuilder()
                .setTitle(`A player has submitted a monster killcount: ${monster}`)
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

            interaction.reply(`Your monster killcount has been submitted!`);
        }
    }
};