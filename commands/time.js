const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Get the lap time for a user on a track!')
        .addStringOption(option =>
            option.setName('track')
                .setDescription('The track you want to get the time for.')
                .setRequired(true)
                .addChoices(
                    { name: 'Silverstone', value: 'silverstone' },
                    { name: 'Monza', value: 'monza' },
                    { name: 'Suzuka', value: 'suzuka' },
                    { name: 'Spa', value: 'spa' },
                    { name: 'Nurburgring', value: 'nurburgring' },
                    { name: 'Imola', value: 'imola' },
                    { name: 'Brands Hatch', value: 'brands_hatch' },
                    { name: 'Barcelona', value: 'barcelona' },
                    { name: 'Zandvoort', value: 'zandvoort' },
                    { name: 'Paul Ricard', value: 'paul_ricard' },
                    { name: 'COTA', value: 'cota' },
                    { name: 'Donnington', value: 'donnington' },
                    { name: 'Hungaroring', value: 'hungaroring' },
                    { name: 'Indianapolis', value: 'indianapolis' },
                    { name: 'Kylami', value: 'kylami' },
                    { name: 'Laguna Seca', value: 'laguna_seca' },
                    { name: 'Misano', value: 'misano' },
                    { name: 'Mount Panorama', value: 'mount_panorama' },
                    { name: 'Oulton Park', value: 'oulton_park' },
                    { name: 'Snetterton', value: 'snetterton' },
                    { name: 'Watkins Glen', value: 'watkins_glen' },
                    { name: 'Zolder', value: 'zolder' }
                ))
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user you want to get the time for.')
                .setRequired(true)),
    async execute(interaction, client) {
        // Get the track and user from the interaction
        const track = interaction.options.getString('track');
        const user = interaction.options.getString('user');

        let data = JSON.parse(fs.readFileSync('./times/acc.json', 'utf8'));
        let times = Object.entries(data);

        // Check if the user has already submitted a time for the track
        let userTimes = times.filter(time => time[1].user === user);

        // If the user has submitted a time for the track, send it
        if (userTimes.length > 0) {
            let time = userTimes.find(time => time[1].track === track);
            if (time) {
                interaction.reply(`The time for ${user} on ${track} is ${time[1].time}`);
            } else {
                interaction.reply(`${user} hasn't submitted a time for ${track} yet!`);
            }
        } else {
            interaction.reply(`${user} hasn't submitted a time for any tracks yet!`);
        }
    }
};