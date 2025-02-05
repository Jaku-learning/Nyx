//Class requirement
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const eventHandler = require('./handlers/eventHandler');

//Client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

const guild = client.guilds.cache.get("1186040107732570153");
client.commands = new Collection();

eventHandler(client);

//Connect to discord with token

client.login(token);