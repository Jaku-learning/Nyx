require('dotenv').config();
const { SlashCommandBuilder, ApplicationCommandOptionType, InteractionContextType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const getLocalCommands = require('../../utils/getLocalCommands');
const getApplicationCommands = require('../../utils/getApplicationCommands');

/*const categories = [
	{ name: "commands", value: "commands" },
	{ name: "bot", value: "bot"}
];

let data = new discord.SlashCommandBuilder()
	.setName('reload')
	.setDescription('Reset a command for testing (developer use only).')
	.addStringOption(option =>
		option
			.setName('command')
			.setDescription('Command to reload.')
			.setRequired(true));

		categories.forEach(cat => {
			data.options[0].addChoices(cat);
		}),*/

module.exports = {
	name: 'reload',
	description: 'Reset a command for testing (developer use only).',
	devOnly: true,
	server: true,
	options: [{
		name: 'command',
		description: 'Command to reload.',
		type: ApplicationCommandOptionType.String,
	}, ],
	permissionsRequired: [PermissionFlagsBits.Administrator],

	callback: async (client, interaction) => {
		const applicationCommands = getApplicationCommands(client, process.env.SERVER_ID);
		const cmdName = interaction.options.getString('command', true).toLowerCase();

		const commandList = await applicationCommands.cache();

		if (!commandList || !commandList.size) {
			return interaction.reply('No commands found in cache.');
		}

		const existingCommand = commandList.find(
			(cmd) => cmd.name === cmdName
		);

		if (!existingCommand) {
			return interaction.reply(`There is no command with the name ${cmdName}!`);
		}

		delete require.cache[require.resolve(`${cmdName}.js`)]; //remove cache for outdated command

		try {
			const newCommand = require(`${cmdName}.js`);
			interaction.client.commands.set(cmdName, newCommand);
			interaction.reply(`The command /${cmdName} was reloaded`);

		} catch (error) {
			console.error(error);
			await interaction.reply(`There was an error whilst reloading the command \`${command.data.name}\`:\n\`${error.message}`);
		}

		console.log('Fetched applicationCommands:', applicationCommands);
		console.log('Fetched commandList:', commandList);
	},
};