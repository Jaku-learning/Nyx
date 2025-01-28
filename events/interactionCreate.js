const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    on: true,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return; //if interaction isnt command ignore
        console.log(interaction);

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command has been found that matches with the name ${interaction.commandName}.`);
            return;
        }

        try {
            command.execute(interaction);
        } catch (error) {
            console.error(`An error has occurred whilst trying to execute the command: ${interaction.commandName}`);
            console.error(error);
        }
            
    },
};