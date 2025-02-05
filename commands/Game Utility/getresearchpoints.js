const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

function rollDiceInt(min, max) {
	return Math.floor(Math.random() * Math.floor(max) + min);
}

module.exports = {
	name: 'getresearchpoints',
	description: 'Calculate your research points in an instant! Once a year!',
	server: true,
	options: [
		{
			name: 'literacy_rate',
			description: `Your nation's literact rate, check it with /profile!`,
			required: true,
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},

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

		{
			name: 'year',
			description: `Current IRP year, must be correct or else the result will be void!`,
			required: true,
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},
	],

	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;
		var literacyRate = interaction.options.getInteger('literacy_rate');
		var powerLevel = interaction.options.getString('nation_power');
		const currentYear = interaction.options.getInteger('year');

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

			const multiplier = powerMultipliers[pow] || 0; //If it doesnt have a valid value, set to zero

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

		tempRPs = 0;

		const researchPointsEmbed = new EmbedBuilder()
			.setColor(0x904f8d)
			.setTitle('<:arriba:1277991305716432947> RESEARCH POINTS CALCULATOR')
			.setAuthor({ name: `${user.tag}`, iconURL: `${user.avatarURL()}` })
			.setDescription(`
			> <:light:1283459592994553989> Player Literacy Rate:  ${literacyRate}
			> <:bang:1277980082790469695> Player Nation Status: ${powerLevel}
			> <:cherry:1283459824209629347> Total Rolls:  ${rollsNumber}
			> <:question_mark:1283459461620568145> Total Research Points:  ${researchPoints}
			> <:world:1283459444705071207> In-Game Year for Rolls: ${currentYear}

			Player: <@${user.id}>`)
			.setThumbnail('https://pbs.twimg.com/media/FNp7AC7XEAE41zT.png:large');
		await interaction.deferReply({ ephemeral: true });
		channel.send({ embeds: [researchPointsEmbed] })
	},
};
