const fs = require('fs');
const { Client, Collection, GatewayIntentBits, Options, IntentsBitField } = require('discord.js');
const { group } = require('console');
const dotenv = require('dotenv').config({ path: 'config.env' });

const intents = new IntentsBitField();
intents.add(GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences);
const client = new Client({ intents: intents });

client.commands = new Collection();
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
}

const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}

client.on('interactionCreate', async (interaction) => {
    const command = client.commands.get(interaction.commandName)
    if (!command) return

    if (interaction.isChatInputCommand()) {
        try {
            await console.log(
                `/${interaction.commandName} — ${interaction.user.username}`
            )
            await command.execute(interaction, client)
        } catch (error) {
            console.error(error)
            return interaction.reply({
                content: "An error occurred while executing this command!",
                ephemeral: true,
                fetchReply: true
            })
        }
    } else if (interaction.isAutocomplete()) {
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
        }
    } else {
        return;
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        const button = interaction.component;
        if (!button) return;

        const message = await interaction.channel.messages.fetch(interaction.message.id);
        const messageEmbed = message.embeds[0];
        const author = messageEmbed.author;
        const user = client.users.cache.find(user => user.username === author.name);
        let teamName = 'No Team';

        let title = messageEmbed.title;
        let subject; let invoLevel; let groupSize; let monster; let kc; let minigame; let minigameKC; let farmingType; let farmingValue; let challenge; let time; let playerCount;

        if (title.includes('collection log entry')) {
            let split = title.split('collection log entry: ');
            subject = split[1];
        } else if (title.includes('submitted a minigame')) {
            let split = title.split('submitted a minigame: ');
            let descSplit = messageEmbed.description.split('value: ');
            subject = split[1] + " " + descSplit[1] + " (kc/points)";

            minigame = split[1];
            minigameKC = descSplit[1];
        } else if (title.includes('TOA KC')) {
            let split = messageEmbed.description.split('Invocation Level: ');
            let titleSplit = title.split('Group Size - ');
            invoLevel = split[1];
            groupSize = titleSplit[1];

            subject = split[1] + " Invocation TOA KC";
        } else if (title.includes('monster killcount: ')) {
            let split = title.split('monster killcount: ');
            let descSplit = messageEmbed.description.split('value: ');
            subject = descSplit[1] + "kc of " + split[1];

            monster = split[1];
            kc = descSplit[1];
        } else if (title.includes('contracts/points:')) {
            let split = title.split('contracts/points: ');
            let descSplit = messageEmbed.description.split('value: ');
            subject = descSplit[1] + " " + split[1];

            farmingType = split[1];
            farmingValue = descSplit[1];
        } else if (title.includes('challenge: ')) {
            challenge = title.split('challenge: ');
            let descSplit = messageEmbed.description.split(' | ');
            time = descSplit[0].split('Current time: ');
            playerCount = descSplit[1].split('Player Count: ');

            time = time[1];
            playerCount = playerCount[1];
            challenge = challenge[1];
        } else {
            subject = "Error: Subject not found";
        }

        let screenshot = messageEmbed.image.url;

        const teams = require('./bingo-info/teams.json');
        for (const team of teams) {
            for (const player of team.players) {
                if (player.tag === author.name) {
                    teamName = team.name;
                    break;
                }
            }
        }

        const teamCategory = interaction.guild.channels.cache.find(channel => channel.name === teamName);
        //const mainChat = interaction.guild.channels.cache.find(channel => channel.name === 'main-chat' && channel.parentId === teamCategory.id);

        if (button.customId === 'approve') {
            //mainChat.send(`The ${subject} from ${user} has been approved.`);
            message.edit({ components: [] });

            message.react('✅');
        } else if (button.customId === 'deny') {
            //mainChat.send(`The ${subject} from ${user} has been denied.`);
            message.edit({ components: [] });

            message.react('❌');
        }

        // Google Sheets API
        const { GoogleSpreadsheet } = require('google-spreadsheet');
        const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await doc.loadInfo();


        if (button.customId === 'approve') {
            if (title.includes('collection log entry')) {
                const sheet = doc.sheetsByIndex[1];
                sheet.addRow({
                    'Discord Name': author.name,
                    'Team Name': teamName,
                    'Item': subject,
                    'Screenshot URL': screenshot
                });
            } else if (title.includes('submitted a minigame')) {
                const sheet = doc.sheetsByIndex[2];
                sheet.addRow({
                    'Discord Name': author.name,
                    'Minigame': minigame,
                    'Kill Count': minigameKC,
                    'Team Name': teamName,
                    'Screenshot URL': screenshot
                });
            } else if (title.includes('TOA KC')) {
                const sheet = doc.sheetsByIndex[3];
                sheet.addRow({
                    'Discord Name': author.name,
                    'Invocation': invoLevel,
                    'Group Size': groupSize,
                    'Team Name': teamName,
                    'Screenshot URL': screenshot
                });
            } else if (title.includes('monster killcount: ')) {
                const sheet = doc.sheetsByIndex[4];
                sheet.addRow({
                    'Discord Name': author.name,
                    'Monster': monster,
                    'Kill Count': kc,
                    'Team Name': teamName,
                    'Screenshot URL': screenshot
                });
            } else if (title.includes('contracts/points: ')) {
                const sheet = doc.sheetsByIndex[5];
                sheet.addRow({
                    'Discord Name': author.name,
                    'Farming Type': farmingType,
                    'Contracts/Points': farmingValue,
                    'Team Name': teamName,
                    'Screenshot URL': screenshot
                });
            } else if (title.includes('challenge: ')) {
                const sheet = doc.sheetsByIndex[6];
                sheet.addRow({
                    'Discord Name': author.name,
                    'Challenge': challenge,
                    'Time': time,
                    'Player Count': playerCount,
                    'Team Name': teamName,
                    'Screenshot URL': screenshot
                });
            }
        }
    }
})

client.on('ready', async () => {
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    const doc = new GoogleSpreadsheet(process.env.SIGNUP_SHEET_ID);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[1];
    const rows = await sheet.getRows({ offset: 2, limit: 180 });

    function assignCompetitorRole() {
        for (const row of rows) {
            if (row['Discord'] !== '') {
                const user = client.users.cache.find(user => user.username === row['Discord']);

                if (user) {
                    const role = user.guild.roles.cache.find(role => role.name === 'Competitor');

                    if (!user.roles.cache.has(role.id)) {
                        user.roles.add(role);
                    }
                }
            }
        }
    }

    const signupSheet = doc.sheetsByIndex[0];
    const signupRows = await signupSheet.getRows({ offset: 1 });

    function assignSignupRole() {
        for (const row of signupRows) {
            if (row['Discord'] !== '') {
                const user = client.users.cache.find(user => user.username === row['Discord']);

                if (user) {
                    const role = user.guild.roles.cache.find(role => role.name === 'Signup');

                    if (!user.roles.cache.has(role.id)) {
                        user.roles.add(role);
                    }
                }
            }
        }
    }


    var CronJob = require('cron').CronJob;
    var job = new CronJob('0 0 0 * * *', function () {
        assignCompetitorRole();
        assignSignupRole();
    }, null, true, 'America/Los_Angeles');
    job.start();
});

client.login(process.env.TOKEN);