require('dotenv').config();

//Class requirement
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const dbPath = path.join(__dirname, './utils/database/database.json');

const databaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: "astralis-nrp",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

fs.writeFileSync(dbPath, JSON.stringify(databaseConfig, null, 2), 'utf-8');
console.log("Generated database.json");

//Client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

const guild = client.guilds.cache.get("1186040107732570153");
client.commands = new Collection();

eventHandler(client);

//Connect to discord with token

client.login(process.env.TOKEN);