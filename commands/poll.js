const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll!')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the poll to')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question to ask')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('The first option')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('The second option')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('option3')
                .setDescription('The third option')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option4')
                .setDescription('The fourth option')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('option5')
                .setDescription('The fifth option')
                .setRequired(false)
        ),
    async execute(interaction, client) {
        let channel = interaction.options.getString('channel-id');
        let question = interaction.options.getString('question');
        let option1 = interaction.options.getString('option1');
        let option2 = interaction.options.getString('option2');
        let option3 = interaction.options.getString('option3');
        let option4 = interaction.options.getString('option4');
        let option5 = interaction.options.getString('option5');

        const pollChannel = client.channels.cache.get(channel);

        let description = '';

        if (option1) {description += `1️⃣ ${option1}`;}
        if (option2) {description += ` 2️⃣ ${option2}`;}
        if (option3) {description += ` 3️⃣ ${option3}`;}
        if (option4) {description += ` 4️⃣ ${option4}`;}
        if (option5) {description += ` 5️⃣ ${option5}`;}

        const embed = new EmbedBuilder()
            .setTitle(question)
            .setDescription(description)
            .setTimestamp()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
            .setColor('#0099ff');
        
        pollChannel.send({ embeds: [embed] }).then(embedMessage => {
            if (option1) {
                embedMessage.react('1️⃣');
                setTimeout(() => {}, 1000);
            }
            if (option2) {
                embedMessage.react('2️⃣');
                setTimeout(() => {}, 1000);
            }
            if (option3) {
                embedMessage.react('3️⃣');
                setTimeout(() => {}, 1000);
            }
            if (option4) {
                embedMessage.react('4️⃣');
                setTimeout(() => {}, 1000);
            }
            if (option5) {
                embedMessage.react('5️⃣');
                setTimeout(() => {}, 1000);
            }
        });

        await interaction.reply({ content: 'Poll created!', ephemeral: true });
    }
}