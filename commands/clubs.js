const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clubs')
        .setDescription('Get random positions for clubs!')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user you want to get a position for.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('user2')
                .setDescription('The second user you want to get a position for.')
                .setRequired(false),
        )
        .addStringOption(option =>
            option.setName('user3')
                .setDescription('The third user you want to get a position for.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('user4')
                .setDescription('The fourth user you want to get a position for.')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('user5')
                .setDescription('The fifth user you want to get a position for.')
                .setRequired(false)
        ),
    async execute(interaction, client) {
        // Get the users from the interaction
        const user1 = interaction.options.getString('user');
        const user2 = interaction.options.getString('user2');
        const user3 = interaction.options.getString('user3');
        const user4 = interaction.options.getString('user4');
        const user5 = interaction.options.getString('user5');

        // Get the users who have been submitted
        let users = [];

        if (user1) users.push(user1);
        if (user2) users.push(user2);
        if (user3) users.push(user3);
        if (user4) users.push(user4);
        if (user5) users.push(user5);

        // Get the positions
        let positions = ['LS', 'RS', 'CAM', 'LCM', 'RCM', 'CDM', 'LB', 'LCB', 'RCB', 'RB', 'GK', 'Choice'];

        // Get the random positions
        let randomPositions = [];
        for (let i = 0; i < users.length; i++) {
            randomPositions.push(positions[Math.floor(Math.random() * positions.length)]);
        }

        // Create the embed
        for (let i = 0; i < users.length; i++) {
            const embed = new EmbedBuilder()
                .setTitle('Club Positions')
                .setDescription('Here are your positions!')
                .setColor('#0099ff')
                .addFields(
                    { name: users[i], value: randomPositions[i], inline: true },
                )
                .setTimestamp();
        
            if (i === 0) {
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.followUp({ embeds: [embed] });
            }
        }
    }
};