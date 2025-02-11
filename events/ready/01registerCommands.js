require('dotenv').config();

const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
	try {
		const localCommands = getLocalCommands();
		const applicationCommands = await getApplicationCommands(client, process.env.SERVER_ID);

		const existingCommands = await applicationCommands.fetch();

		for (const command of existingCommands.values()) {
			await applicationCommands.delete(command.id);
			console.log(`Deleted command /${command.name}`);
		}

		for (const localCommand of localCommands) {
			const { name, description, options } = localCommand;

			if (localCommand.deleted) {
				console.log(`Skipping registering command ${name} as it is set for deletion.`);
				continue;
			}

			await applicationCommands.create({
				name,
				description,
				options,
			});

			console.log(`Registered the command /${name} successfully!`);
		}

	} catch (error) {
		console.error(`There was an error! ${error}`);
	}
};
