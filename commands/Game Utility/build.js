const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');
module.exports = {
	name: 'build',
	description: 'Construct special structures using resources for your nation!',
	server: true,
	callback: async (client, interaction) => {
		const { user, member, message, channel } = interaction;

		const country = await getColorCode(member);
		const coal = await getData(country.id, 'coal', 1)

		interaction.reply(`DEV DATA >>> Coal in DB returns: ${coal}`)
	}
};