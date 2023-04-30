const fs = require('fs');
const { Client, Collection, GatewayIntentBits, Options, IntentsBitField } = require('discord.js');
const dotenv = require('dotenv').config({path: 'config.env'});

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
  if (!interaction.isCommand()) return
  const command = client.commands.get(interaction.commandName)
  if (!command) return

  try {
    await console.log(
      `/${interaction.commandName} — Par ${interaction.user.username}`
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
});

// When button is clicked reply who has clicked it
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return

    // Accept Button
    if (interaction.customId === 'approve') {
        await interaction.update({
            content: `${interaction.user.username} has approved this submission!`,
            ephemeral: true
        });
    }

    // Decline Button
    if (interaction.customId === 'deny') {
        await interaction.update({
            content: `${interaction.user.username} has denied this submission!`,
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);