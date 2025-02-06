require('dotenv').config();
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
	try {
		const localCommands = getLocalCommands();
		const applicationCommands = await getApplicationCommands(client, process.env.SERVER_ID);

		for (const localCommand of localCommands) {
			const { name, description, options } = localCommand;

			const existingCommand = await applicationCommands.cache.find(
				(cmd) => cmd.name === name
			);

			if (existingCommand) {
				if (localCommand.deleted) {
					await applicationCommands.deleted(existingCommand.id);
					console.log(`Deleted command /${name}`);
					return;
				}

				if (areCommandsDifferent(existingCommand, localCommand)) {
					await applicationCommands.edit(existingCommand.id, {
						description,
						options,
					});

					console.log(`Edited the command /${name}`);
				}
			} else {
				if (localCommand.deleted) {
					console.log(`Skipping registering command ${name} as it is set for deletion.`);
					continue;
				}

				await applicationCommands.create({
					name,
					description,
					options,
				});

				console.log (`Registered the command ${name} successfully!`)
			}
		}
	} catch (error) {
		console.log(`There was an error! ${error}`);
	}
	//console.log(localCommands);
};
