const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
//Obtain all files from command directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//Attain the output of SlashCommandBuilder#toJSON() of every command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

//Build and prepare instance of module REST
const rest = new REST({ version: 10 }).setToken(token);

//Deploy commands

(async () => {
    try {
        console.log(`Nyx has begun to update ${commands.length} commands on the app! (/).`);

        //Method PUT used to fully update all commabnds in the server with the current set
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log(`Nyx has updated ${data.length} commands of the app successfully (/).`)
    } catch (error) {
        //Detect and register errors
        console.error(error);
    }
})();