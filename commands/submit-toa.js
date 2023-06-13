const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_toa')
        .setDescription('Submit toa kc for the bingo! (Make sure the kc is in the screenshot)')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the kc you are submitting')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('invocation-level')
                .setDescription('The level of invocation you were running')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('group-size')
                .setDescription('The group size you were running with')
                .setRequired(true)
                .addChoices(
                    { name: 'Solo', value: 'Solo' },
                    { name: 'Group', value: 'Group' },
                )),        
    async execute(interaction, client) {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            let screenshot = interaction.options.getAttachment('screenshot');
            let invoLevel = interaction.options.getInteger('invocation-level');
            let groupSize = interaction.options.getString('group-size');

            const channel = client.channels.cache.find(channel => channel.name === "data-submissions");

            const embed = new EmbedBuilder()
                .setTitle(`A player has submitted TOA KC: Group Size - ${groupSize}`)
                .setDescription(`Invocation Level: ${invoLevel}`)
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

            interaction.reply(`Your toa kc has been submitted!`);
        }
    }
};