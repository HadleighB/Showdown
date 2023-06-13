const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('board')
        .setDescription('Get the current bingo board'),
    async execute(interaction, client) {
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            const fs = require('fs');
            const config = JSON.parse(fs.readFileSync('./bingo-info/teams.json', 'utf8'));

            const teamNames = [];
            for (const team in config) {
                teamNames.push(config[team].name);
            }

            const roles = interaction.member.roles.cache.map(role => role.name);
            let board;
            let boardImage;
            let teamName;
            let teamColor;
            let onTeam = false;

            for (const team in config) {
                if (roles.some(role => role === config[team].name)) {
                    onTeam = true;
                    board = config[team].board;
                    boardImage = config[team].boardImage;
                    teamName = config[team].name;
                    teamColor = config[team].color;
                }
            }

            if (!onTeam) {
                const spectatorConfig = JSON.parse(fs.readFileSync('./bingo-info/spectators.json', 'utf8'));
                board = spectatorConfig.board;
                boardImage = spectatorConfig.boardImage;
                teamName = spectatorConfig.name;
                teamColor = spectatorConfig.color;
            }

            const embed = new EmbedBuilder()
                .setTitle(`${teamName} Bingo Board`)
                .setDescription('Click the link below to view the board')
                .setURL(board)
                .setImage(boardImage)
                .setColor(teamColor)

            await interaction.reply({embeds: [embed]});
        }
    }
};