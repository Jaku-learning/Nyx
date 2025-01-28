//Class requirement
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits} = require('discord.js');
const { token } = require('./config.json');

//Client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const guild = client.guilds.cache.get("1186040107732570153");

client.commands = new Collection();
//guild.commands.set([]);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

//Command manager
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    //Establish new element on collection, command's name is the key and the value of exported module

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command in ${filePath} is missing a "data" or "execute" property.`)
    }
}

//Event manager
for (const file of eventsFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));

    }
}

//Connect to discord with token

client.login(token);