const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit_challenges')
        .setDescription('Submit a tithe points/farming contracts for the bingo!')
        .addAttachmentOption(option =>
            option.setName('screenshot')
                .setDescription('The screenshot of the minigame you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('The time of challenge you are submitting')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('challenge')
                .setDescription('The challenge you are submitting')
                .setRequired(true)
                .addChoices(
                    { name: 'Corrupted Gauntlet', value: 'corrupted-gauntlet' },
                    { name: 'Tombs of Amascut', value: 'tombs-of-amascut' },
                    { name: "Chambers of Xeric", value: "chambers-of-xeric" },
                    { name: "Barbarian Assault", value: "barbarian-assault" },
                ))
        .addIntegerOption(option =>
            option.setName('player_count')
                .setDescription('The number of players in the challenge')
                .setRequired(true)),
    async execute(interaction, client) {
        let screenshot = interaction.options.getAttachment('screenshot');
        let time = interaction.options.getString('time');
        let challenge = interaction.options.getString('challenge');
        let player_count = interaction.options.getInteger('player_count');

        const channel = client.channels.cache.get('1118260344603816047');

        if (!screenshot.url.endsWith('.png') && !screenshot.url.endsWith('.jpg') && !screenshot.url.endsWith('.jpeg') && !screenshot.url.endsWith('.PNG') && !screenshot.url.endsWith('.JPG') && !screenshot.url.endsWith('.JPEG')) {
            screenshot.url = "https://cdn-icons-png.flaticon.com/512/6231/6231942.png";
        }

        const embed = new EmbedBuilder()
            .setTitle(`A player has submitted a challenge: ${challenge}`)
            .setDescription(`Current time: ${time} | Player Count: ${player_count}`)
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

        interaction.reply(`Your challenge has been submitted!`);
    }
};