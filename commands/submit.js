const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submit a track time!')
        .addStringOption(option =>
            option.setName('track')
                .setDescription('The track you want to submit a time for.')
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
            option.setName('time')
                .setDescription('The time you want to submit.')
                .setRequired(true)),
    async execute(interaction, client) {
        // Get the track and time from the interaction
        const track = interaction.options.getString('track');
        const time = interaction.options.getString('time');
        
        // Get the user who submitted the time
        const user = '<@' + interaction.user.id + '>';

        let data = JSON.parse(fs.readFileSync('./times/acc.json', 'utf8'));
        let times = Object.entries(data);

        // Check if the user has already submitted a time for the track
        let userTimes = times.filter(time => time[1].user === user && time[1].track === track);

        if (userTimes.length > 0) {
            // If they have, update the time
            data[userTimes[0][0]].time = time;
            await interaction.reply('Time updated!');
        } else {
            // If they haven't, add a new time
            data.push({
                user: user,
                track: track,
                time: time
            });
            await interaction.reply('Time submitted!');
        }
        
        // Write the new data to the file
        fs.writeFileSync('./times/acc.json', JSON.stringify(data, null, 2));
    }
};