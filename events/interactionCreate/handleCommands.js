require('dotenv').config();
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
        const localCommands = getLocalCommands();

        try {
            const commandObject = localCommands.find(
                (cmd) => cmd.name === interaction.commandName
            );

            if (!commandObject) return;

            if (commandObject.devOnly) {
                const devs = process.env.DEVELOPERS.split(',');
                if (!devs.includes(interaction.member.id)) {
                    interaction.reply(`You can't use that command retard!`);
                    return;
                }
            }

            if (commandObject.serverOnly) {
                if (interaction.guild.id !== process.env.SERVER_ID) {
                    interaction.reply(`You can't use that command in this server donkey!`);
                    return;
                }
            }

            if (commandObject.permissionsRequired?.length) {
                for (const permission of commandObject.permissionsRequired) {
                    if (!interaction.member.permissions.has(permission)) {
                        interaction.reply(`You don't have enough permissions to run this command dummy!`);
                        return;
                    }
                }
            }
            await commandObject.callback(client, interaction);
        } catch (error) {
            console.log(`There was an error running this command: ${error} at line ${error.line}`);
            console.trace(error);
        }
    } else if (interaction.isButton()) {
        return;
    } else if (!interaction.isStringSelectMenu()) {
        return;
    } else if (interaction.isStringSelectMenu()) {
        console.log(interaction.values);

        if (interaction.customId === 'rebel-stager') {
            let choices = "";
            await interaction.values.forEach(async value => {
                choices += `${value}`;
            });
        }
    }
};
