require('dotenv').config();

const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, process.env.SERVER_ID);

        const existingCommands = await applicationCommands.fetch();

        for (const command of existingCommands.values()) {
            const localCommand = localCommands.find(cmd => cmd.name === command.name);

            if (!localCommand || localCommand.deleted) {
                await applicationCommands.delete(command.id);
                continue;
            }

            const isDifferent = (
                command.description !== localCommand.description ||
                JSON.stringify(command.options || []) !== JSON.stringify(localCommand.options || [])
            );

            if (isDifferent) {
                await applicationCommands.edit(command.id, {
                    name: localCommand.name,
                    description: localCommand.description,
                    options: localCommand.options
                });
                console.log(`Updated /${localCommand.name}`);
            }
        }

        for (const localCommand of localCommands) {
            if (existingCommands.some(cmd => cmd.name === localCommand.name)) continue;

            const { name, description, options } = localCommand;

            if (localCommand.deleted) {
                continue;
            }

            await applicationCommands.create({
                name,
                description,
                options,
            });

            console.log(`reegistered /${name}`);
        }

    } catch (error) {
        console.error(`error: ${error}`);
    }
};
