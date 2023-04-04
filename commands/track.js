const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('track')
        .setDescription('Get the lap times for all users on a track!')
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
                )),
    async execute(interaction, client) {
        // Get the track and user from the interaction
        const track = interaction.options.getString('track');

        let data = JSON.parse(fs.readFileSync('./times/acc.json', 'utf8'));
        let times = Object.entries(data);

        // Get all the times for the track
        let trackTimes = times.filter(time => time[1].track === track);
        // Sort the times
        trackTimes.sort((a, b) => a[1].time - b[1].time);

        // Send all the times
        let timesString = '';
        trackTimes.forEach(time => {
            timesString += `${time[1].user}: ${time[1].time}\n`;
        });
        interaction.reply(`The times for ${track} are:\n${timesString}`);
    }
};