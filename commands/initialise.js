const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require ('dotenv').config({path: '../config.env'});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('initialise')
        .setDescription('Create channels & roles from the config file!'),
    async execute(interaction, client) {
        const fs = require('fs');
        const config = JSON.parse(fs.readFileSync('./bingo-info/teams.json', 'utf8'));
        const guild = client.guilds.cache.get(process.env.GUILD_ID);

        // Create the roles
        for (const team in config) {
            if (guild.roles.cache.find(role => role.name === config[team].name)) {
            } else {
                await guild.roles.create({
                    name: config[team].name,
                    color: config[team].color,
                    hoist: true,
                    mentionable: true
                });
            }
        }

        // Assign the roles
        for (const team in config) {
            const role = await guild.roles.cache.find(role => role.name === config[team].name);
            const players = config[team].players;

            for (const player of players) {
                const user = await guild.members.fetch({ query: player.name, limit: 1 });
                const userID = user.first().id;
                guild.members.edit(userID, { roles: [role] });
            }
        }

        // Create the categories
        function createCategories() {
            for (const team in config) {
                if (guild.channels.cache.find(channel => channel.name === config[team].name)) {
                } else {
                    guild.channels.create({
                        name: config[team].name,
                        type: 4,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: [PermissionFlagsBits.ViewChannel]
                            }
                        ]
                    });
                }
            }
            return;
        }

        // Create the channels
        async function createChannels() {
            await createCategories();
            await new Promise(resolve => setTimeout(resolve, 2000));

            for (const team in config) {
                let teamChannels = [
                    {
                        name: 'screenshots',
                        type: 0
                    },
                    {
                        name: 'main-chat',
                        type: 0
                    },
                    {
                        name: 'voice',
                        type: 2
                    }
                ];

                for (const teamChannel of teamChannels) {
                    const parent = await guild.channels.cache.find(channel => channel.name === config[team].name);

                    if (guild.channels.cache.find(channel => channel.name === teamChannel.name)) {
                    } else {
                        guild.channels.create({
                            name: teamChannel.name,
                            type: teamChannel.type,
                            parent: parent
                        });
                    }
                }
            }
        }
        createChannels();

        // Set the permissions for the channels
        async function setPermissions() {
            await createCategories();
            await new Promise(resolve => setTimeout(resolve, 2000));

            for (const team in config) {
                const role = await guild.roles.cache.find(role => role.name === config[team].name);
                const channels = await guild.channels.cache.filter(channel => channel.name === config[team].name);

                for (const channel of channels) {
                    const channelID = channel[1].id;
                    await guild.channels.cache.get(channelID).permissionOverwrites.create(role, { [PermissionFlagsBits.ViewChannel]: true });
                }
            }
        }
        setPermissions();
    }
};