/*const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check the bot´s ping / latency!'),
	async execute(client, interaction) {

		await interaction.deferReply({ ephemeral: false });

		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		await interaction.editReply(
			`Client ${ping}ms | Websocket: ${client.ws.ping}ms`
		);
	},
};*/

module.exports = {
	name: 'ping',
	description: 'Check the bot´s ping / latency!',
	server: true,
	devOnly: true,
	callback: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: false });

		const reply = await interaction.fetchReply();

		const ping = reply.createdTimestamp - interaction.createdTimestamp;

		await interaction.editReply(
			`Client ${ping}ms | Websocket: ${client.ws.ping}ms`
		);
	},
};
