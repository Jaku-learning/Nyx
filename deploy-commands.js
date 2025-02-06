require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
//Obtain all files from command directory
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath).filter(folder =>
    !folder.startsWith('.'));

//Attain the output of SlashCommandBuilder#toJSON() of every command's data for deployment
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`${foldersPath}/${folder}/${file}`);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log('Read [WARNINGS]')
        }
    }
}

//Build and prepare instance of module REST
const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);

//Deploy commands

(async () => {
    try {
        console.log(`Nyx has begun to update ${commands.length} commands on the app! (/).`);

        //Method PUT used to fully update all commabnds in the server with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
            { body: commands },
        );
        console.log(`Nyx has updated ${data.length} commands of the app successfully (/).`)
    } catch (error) {
        //Detect and register errors
        console.error(error);
    }
})();
