const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function rollDiceInt(min, max) {
	return Math.floor(Math.random() * Math.floor(max) + min);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getresearchpoints')
		.setDescription('Calculate your research points in an instant! Once a year!')
		.addIntegerOption(option =>
			option
				.setName('literacy_rate')
				.setDescription(`Your nation's literact rate, check it with /profile!`)
				.setRequired(true)
				.setMinValue(1))
		.addStringOption(option =>
			option
				.setName('nation_power')
				.setDescription(`Input your status! If you don't have the regional or superpower rank, put minor power.`)
				.setRequired(true)
				.addChoices(
					{ name: 'Minor Power', value: 'Minor Power' },
					{ name: 'Regional Power', value: 'Regional Power' },
					{ name: 'Superpower', value: 'Superpower' }

				)
		)
		.addIntegerOption(option =>
			option
				.setName('year')
				.setDescription(`Current IRP year, must be correct or else the result will be void!`)
				.setRequired(true)
				.setMinValue(1)),

	async execute(interaction) {
		const { user, member, channel } = interaction;
		var literacyRate = interaction.options.getInteger('literacy_rate');
		var powerLevel = interaction.options.getString('nation_power');
		const currentYear = interaction.options.getInteger('year');

		//Dice rolls
		var rollsNumber = 0;
		var tempRPs = 0;
		var researchPoints = 0;

		//MINOR POWER ROLLS
		if (literacyRate <= 9 && powerLevel == "Minor Power") {
			rollsNumber = 0;
		} else if (literacyRate >= 10 && literacyRate <= 19 && powerLevel == "Minor Power") {
			rollsNumber = 8;
		} else if (literacyRate >= 20 && literacyRate <= 29 && powerLevel == "Minor Power") {
			rollsNumber = 16;
		} else if (literacyRate >= 30 && literacyRate <= 39 && powerLevel == "Minor Power") {
			rollsNumber = 24;
		} else if (literacyRate >= 40 && literacyRate <= 49 && powerLevel == "Minor Power") {
			rollsNumber = 32;
		} else if (literacyRate >= 50 && literacyRate <= 59 && powerLevel == "Minor Power") {
			rollsNumber = 40;
		} else if (literacyRate >= 60 && literacyRate <= 69 && powerLevel == "Minor Power") {
			rollsNumber = 48;
		} else if (literacyRate >= 70 && literacyRate <= 79 && powerLevel == "Minor Power") {
			rollsNumber = 56;
		} else if (literacyRate >= 80 && literacyRate <= 89 && powerLevel == "Minor Power") {
			rollsNumber = 64;
		} else if (literacyRate >= 90 && literacyRate <= 99 && powerLevel == "Minor Power") {
			rollsNumber = 72;
		}

		// REGIONAL POWER

		if (literacyRate <= 9 && powerLevel == "Regional Power") {
			rollsNumber = 0;
		} else if (literacyRate >= 10 && literacyRate <= 19 && powerLevel == "Regional Power") {
			rollsNumber = 10;
		} else if (literacyRate >= 20 && literacyRate <= 29 && powerLevel == "Regional Power") {
			rollsNumber = 20;
		} else if (literacyRate >= 30 && literacyRate <= 39 && powerLevel == "Regional Power") {
			rollsNumber = 30;
		} else if (literacyRate >= 40 && literacyRate <= 49 && powerLevel == "Regional Power") {
			rollsNumber = 40;
		} else if (literacyRate >= 50 && literacyRate <= 59 && powerLevel == "Regional Power") {
			rollsNumber = 50;
		} else if (literacyRate >= 60 && literacyRate <= 69 && powerLevel == "Regional Power") {
			rollsNumber = 60;
		} else if (literacyRate >= 70 && literacyRate <= 79 && powerLevel == "Regional Power") {
			rollsNumber = 70;
		} else if (literacyRate >= 80 && literacyRate <= 89 && powerLevel == "Regional Power") {
			rollsNumber = 80;
		} else if (literacyRate >= 90 && literacyRate <= 99 && powerLevel == "Regional Power") {
			rollsNumber = 90;
		}

		// SUPERPOWER
		if (literacyRate <= 9 && powerLevel == "Superpower") {
			rollsNumber = 0;
		} else if (literacyRate >= 10 && literacyRate <= 19 && powerLevel == "Superpower") {
			rollsNumber = 12;
		} else if (literacyRate >= 20 && literacyRate <= 29 && powerLevel == "Superpower") {
			rollsNumber = 24;
		} else if (literacyRate >= 30 && literacyRate <= 39 && powerLevel == "Superpower") {
			rollsNumber = 36;
		} else if (literacyRate >= 40 && literacyRate <= 49 && powerLevel == "Superpower") {
			rollsNumber = 48;
		} else if (literacyRate >= 50 && literacyRate <= 59 && powerLevel == "Superpower") {
			rollsNumber = 60;
		} else if (literacyRate >= 60 && literacyRate <= 69 && powerLevel == "Superpower") {
			rollsNumber = 72;
		} else if (literacyRate >= 70 && literacyRate <= 79 && powerLevel == "Superpower") {
			rollsNumber = 84;
		} else if (literacyRate >= 80 && literacyRate <= 89 && powerLevel == "Superpower") {
			rollsNumber = 96;
		} else if (literacyRate >= 90 && literacyRate <= 99 && powerLevel == "Superpower") {
			rollsNumber = 108;
		}

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
