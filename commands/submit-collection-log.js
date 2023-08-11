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
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        let focusedValue = interaction.options.getString("item-name");
        let items = require('../bingo-info/collection-log-items.json');

        focusedValue = focusedValue.toLowerCase().replace(/[^a-z]/g, '_');

        const filtered = items.filter(item => item.value.startsWith(focusedValue));

        let options;
        if (filtered.length > 25) {
            options = filtered.slice(0, 25);
        } else {
            options = filtered;
        }

        await interaction.respond(
            options.map(item => ({
                name: item.name,
                value: item.value
            }))
        );
    },
    async execute(interaction, client) {
        let screenshot = interaction.options.getAttachment('screenshot');
        let itemName = interaction.options.getString('item-name');

        const channel = client.channels.cache.get('1118260344603816047');

        if (!screenshot.url.endsWith('.png') && !screenshot.url.endsWith('.jpg') && !screenshot.url.endsWith('.jpeg') && !screenshot.url.endsWith('.PNG') && !screenshot.url.endsWith('.JPG') && !screenshot.url.endsWith('.JPEG')) {
            screenshot.url = "https://cdn-icons-png.flaticon.com/512/6231/6231942.png";
        }

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
};