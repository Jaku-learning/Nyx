const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');

function rollDiceInt(min, max) {
	return Math.floor(Math.random() * Math.floor(max) + min);
}

module.exports = {
	name: 'getresearchpoints',
	description: 'Calculate your research points in an instant! Once a year!',
	server: true,
	options: [
		/*{
			name: 'literacy_rate',
			description: `Your nation's literact rate, check it with /profile!`,
			required: true,
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},*/

		{
			name: 'nation_power',
			description: `Your nation's literact rate, check it with /profile!`,
			required: true,
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: 'Minor Power', value: 'Minor Power' },
				{ name: 'Regional Power', value: 'Regional Power' },
				{ name: 'Superpower', value: 'Superpower' },
			],
		},

		/*{
			name: 'year',
			description: `Current IRP year, must be correct or else the result will be void!`,
			required: true,
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},*/
	],

	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;
		var powerLevel = interaction.options.getString('nation_power');
		//const currentYear = interaction.options.getInteger('year');

		const country = await getColorCode(member);
		const literacyRate = Math.floor(await getData(country.id, 'literacy', 1));
		const inGameYear = await getData('server', 'year', 9999);
		const storedRP = await getData(country.id, 'researchpoints', 0);

		var lastUsed = await getData(country.id, 'last_year_used_getresearch', 1980);

		if (lastUsed == inGameYear) { interaction.reply(`You have already claimed your research points for the year **${inGameYear}**, try next year (${inGameYear + 1})`); return; }

		const previousRP = storedRP;

		var rollsNumber = 1;
		var tempRPs = 0;
		var researchPoints = 0;

		function calculateRolls(lit, pow) {
			var rolls = 0;

			const powerMultipliers = {
				"Minor Power": 8,
				"Regional Power": 10,
				"Superpower": 12
			};

			var multiplier = powerMultipliers[pow] || 0; //If it doesnt have a valid value, set to zero

			if (lit < 9) {
				return multiplier = 0;
			} else {
				const tier = Math.min(Math.floor((lit - 10) / 10), 9); //Get rounded down number for the literacy, divide by ten, then grab the lesser number between that and 9
				rolls = (tier + 1) * multiplier; 
			}

			return rolls;
		}

		rollsNumber = calculateRolls(literacyRate, powerLevel);

		for (var i = 0; i < rollsNumber; i++) {
			tempRPs = rollDiceInt(1, 100);
			researchPoints = researchPoints + tempRPs;
		}
		var tempRPs = 0;
		await addData(country.id, 'researchpoints', researchPoints);

		var finalRP = previousRP + researchPoints;

		const researchPointsEmbed = new EmbedBuilder()
			.setColor(0x904f8d)
			.setTitle('<:arriba:1277991305716432947> RESEARCH POINTS CALCULATOR')
			.setAuthor({ name: `${country.name}`, iconURL: `${user.avatarURL()}` })
			.setDescription(`
			> <:light:1283459592994553989> Player Literacy Rate:  ${literacyRate}
			> <:bang:1277980082790469695> Player Nation Status: ${powerLevel}
			> <:cherry:1283459824209629347> Total Rolls:  ${rollsNumber}
			> <:world:1283459444705071207> In-Game Year for Rolls: ${inGameYear}

			Player: <@${user.id}>`)
			.addFields({
				name: 'Research Points', value: `
				> <:question_mark:1283459461620568145> Research Points Stored Previously:  ${previousRP}
				> <:question_mark:1283459461620568145> Research Points Gained:  ${researchPoints}
				> <:question_mark:1283459461620568145> Total Research Points Stored:  ${finalRP}

				`})
			.setThumbnail('https://pbs.twimg.com/media/FNp7AC7XEAE41zT.png:large');
		await interaction.deferReply({ ephemeral: false });
		await interaction.editReply({ embeds: [researchPointsEmbed] })
		await setData(country.id, 'last_year_used_getresearch', inGameYear);
	},
};
