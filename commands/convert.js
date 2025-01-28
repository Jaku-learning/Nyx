const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function rollDiceInt(min, max) {
	return Math.floor(Math.random() * Math.floor(max) + min);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('convert')
		.setDescription('Conduct a conversion roll in an easy way! Only ONCE a year!')
		.addStringOption(option =>
			option
				.setName('policy')
				.setDescription(`Your occupational policy to deal with rebellious pops.`)
				.setRequired(true)
				.addChoices(
					{ name: 'Cultural Conversion', value:'Cultural Conversion' },
					{ name: 'Purposeful Segregation', value: 'Purposeful Segregation' },
					{ name: 'Indentured Servitude', value: 'Indentured Servitude' },
					{ name: 'Ethnic Cleansing', value: 'Ethnic Cleansing' },
					{ name: 'Extermination', value: 'Extermination' }

			)
		)
		.addIntegerOption(option =>
			option
				.setName('pops')
				.setDescription(`The amount of pops you have yet to convert or deal with.`)
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('year')
				.setDescription(`The amount of pops you have yet to convert or deal with.`)
				.setRequired(true)
				.setMinValue(1)),

	async execute(interaction) {

		const { user, member, channel } = interaction;
		const occupationPolicy = interaction.options.getString('policy');
		const population = interaction.options.getInteger('pops');
		const year = interaction.options.getInteger('year');
		var infamyGain = 0;
		var populationConverted = 0;
		var populationFinal = 0;

		//Base dice roll
		const diceResult = rollDiceInt(1, 20);
		var diceResultFinal = 0;

		//Dice Roll Result Modifiers
		if (occupationPolicy == "Cultural Conversion") {
			diceResultFinal = diceResult + 0;
		} else if (occupationPolicy == "Purposeful Segregation") {
			diceResultFinal = diceResult + 2;
			infamyGain = 10;
		} else if (occupationPolicy == "Indentured Servitude") {
			diceResultFinal = diceResult + 4;
			infamyGain = 25;
		} else if (occupationPolicy == "Ethnic Cleansing") {
			diceResultFinal = diceResult + 6;
			infamyGain = 50;
		} else if (occupationPolicy == "Extermination") {
			diceResultFinal = diceResult + 10;
			infamyGain = 100;
		}

		//Calculate results and define message
		var resultMessage = "";

		if (diceResultFinal == 1) {
			resultMessage = "CATASTROPHIC FAILURE";
		} else if (diceResultFinal >= 2 && diceResultFinal <= 4) {
			resultMessage = "SLIGHT FAILURE";
		} else if (diceResultFinal >= 5 && diceResultFinal <= 9) {
			resultMessage = "FAILURE";
		} else if (diceResultFinal >= 10 && diceResultFinal <= 14) {
			resultMessage = "SLIGHT SUCCESS";
		} else if (diceResultFinal >= 15 && diceResultFinal <= 19) {
			resultMessage = "SUCCESS";
		} else if (diceResultFinal >= 20) {
			resultMessage = "OVERWHELMING SUCCESS";
		}

		//calculate correct pops converted
		if (diceResultFinal == 12 || diceResultFinal == 13) {
			populationConverted = 1;
			populationFinal = population - populationConverted;
		} else if (diceResultFinal == 14 || diceResultFinal == 15) {
			populationConverted = 2;
			populationFinal = population - populationConverted;
		} else if (diceResultFinal == 16 || diceResultFinal == 17) {
			populationConverted = 3;
			populationFinal = population - populationConverted;
		} else if (diceResultFinal == 18 || diceResultFinal == 19) {
			populationConverted = 4;
			populationFinal = population - populationConverted;
		} else if (diceResultFinal == 20) {
			populationConverted = 5;
			populationFinal = population - populationConverted;
		}

		
		const conversionEmbed = new EmbedBuilder()
			.setColor(0x904f8d)
			.setTitle('<:arrow:1283459568621322393> CONVERSION ROLL MENU')
			.setAuthor({ name: `${user.tag}`, iconURL: `${user.avatarURL()}` })
			.setDescription(`
			> <:business:1277981102681620591> Occupation Policy:  ${occupationPolicy}
			> <:rip:1283460054447820940> Rebellious Pops Before Roll:  ${population}
			> <:mag:1277980019615858698> Rebellious Pops After Roll:  ${populationFinal}
			> <:check:1283459658400530556> Converted Pops:  ${populationConverted}
			> <:bang:1277980082790469695> Infamy Gained:  ${infamyGain}
			> <:world:1283459444705071207> In-Game Year for Roll: ${year}
			Player: <@${user.id}>`)
			.setFooter({ text: 'Note: Infamy Gain is only applied if someone finds out IRP, applied ONCE only.', iconURL: `${interaction.client.user.avatarURL()}` })
			.setThumbnail('https://pbs.twimg.com/media/FNp7AC7XEAE41zT.png:large');
		await interaction.deferReply({ ephemeral: true });
		channel.send({
			content: `
			# Final Result: ${diceResultFinal} | ${resultMessage}
			## NAT Result: ${diceResult}`,
			embeds: [conversionEmbed]
		});
	},
};
