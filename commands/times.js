const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('times')
        .setDescription('Get the lap times for a user!')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user you want to get the time for.')
                .setRequired(true)),
    async execute(interaction, client) {
        // Get the user from the interaction
        const user = interaction.options.getString('user');

        let data = JSON.parse(fs.readFileSync('./times/acc.json', 'utf8'));
        let times = Object.entries(data);

        // Get all the times for the user
        let userTimes = times.filter(time => time[1].user === user);

        // If the user has submitted a time, send it
        if (userTimes.length > 0) {
            let timesString = '';
            userTimes.forEach(time => {
                timesString += `${time[1].track}: ${time[1].time}\n`;
            });
            interaction.reply(`The times for ${user} are:\n${timesString}`);
        } else {
            interaction.reply(`${user} hasn't submitted any times yet!`);
        }
    }
};