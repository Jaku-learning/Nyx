const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');

module.exports = {
	name: 'setresearch',
	description: 'Alter someone´s research points! (GM ONLY)',
	server: true,
	options: [
		{
			name: 'country',
			description: 'Target country for data modification.',
			required: true,
			type: ApplicationCommandOptionType.Role,
		},
		{
			name: 'research-points',
			description: 'Amount of points to reduce or add. Negative numbers remove, positive ones add.',
			required: true,
			type: ApplicationCommandOptionType.Integer,
		},
	],

    callback: async (client, interaction) => {
		const { user, member, message, channel } = interaction;
        const country = interaction.options.getRole('country');
        const countryResearch = await getData(country.id, 'researchpoints', 1);

		const alteredAmount = interaction.options.getInteger('research-points');
		
		if ((countryResearch + alteredAmount) <= 0) { interaction.reply(`You can't edit ${country}'s research points value (${countryResearch}) to below-zero (${countryResearch + alteredAmount})! Try again with a different value!`); return; }

        await interaction.deferReply({ ephemeral: false });
        
        await addData(country.id, 'researchpoints', alteredAmount);
        await interaction.editReply(`You have successfully altered ${country}'s research point value from **${countryResearch}** to **${countryResearch+alteredAmount}**!`)
        
	}
};