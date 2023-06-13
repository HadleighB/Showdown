const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_collection_log')
        .setDescription('Submit a collection log item for the bingo! (Make sure the drop is in the screenshot)')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the item you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('item-name')
                .setDescription('The name of the item you are submitting')
                .setRequired(true)),        
    async execute(interaction, client) {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            let screenshot = interaction.options.getAttachment('screenshot');
            let item = interaction.options.getString('item');
            let itemName = interaction.options.getString('item-name');

            const channel = client.channels.cache.get('1118260344603816047');

            const embed = new EmbedBuilder()
                .setTitle(`A player has submitted a collection log entry: ${itemName}`)
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

            interaction.reply(`Your collection log item has been submitted!`);
        }
    }
};