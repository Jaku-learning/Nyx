const { ActionRowBuilder, ApplicationCommandOptionType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ComponentType } = require('../../node_modules/discord-api-types/v10');

function rollDiceInt(min, max) {
	return Math.floor(Math.random() * Math.floor(max) + min);
}

module.exports = {
	name: 'convert',
	description: 'Conduct a conversion roll in an easy way! Only ONCE a year!',
	server: true,
	options: [
		{
			name: 'policy',
			description: 'Your occupational policy to deal with rebellious pops.',
			required: true, 
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: 'Cultural Conversion', value: 'Cultural Conversion' },
				{ name: 'Purposeful Segregation', value: 'Purposeful Segregation' },
				{ name: 'Indentured Servitude', value: 'Indentured Servitude' },
				{ name: 'Ethnic Cleansing', value: 'Ethnic Cleansing' },
				{ name: 'Extermination', value: 'Extermination' },
			],
		},

		{
			name: 'pops',
			description: 'The amount of pops you have yet to convert or deal with.',
			required: true,
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},

		{
			name: 'year',
			description: 'Current year IRP, must be accurate or the result can be voided.',
			required: true,
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},
	],

	callback: async (client, interaction) => {
		const { user, member, message, channel } = interaction;
		const occupationPolicy = interaction.options.getString('policy');
		const population = interaction.options.getInteger('pops');
		const year = interaction.options.getInteger('year');
		var infamyGain = 0;
		var populationConverted = 0;
		var populationFinal = 0;
		var finalSelectionResult = 0;
		var selectionMessage = "";

		const selection = new StringSelectMenuBuilder()
			.setCustomId('rebel-stager')
			.setPlaceholder('Select your current rebellion stage! If unsure, check the <#1310344367273410660> channel!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Minor Protests')
					.setDescription('Note: If your conversion law is Cultural Conversion, start here at first!')
					.setValue('1')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Medium Protests')
					.setDescription('Note: If your conversion law is Purposeful Segregation, start here at first!')
					.setValue('2')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Major Protests')
					.setDescription('Last level of protests before riots begin! Beware!')
					.setValue('3')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Minor Riots')
					.setDescription('Note: If your conversion law is Indentured Servitude, start here at first!')
					.setValue('4')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Medium Riots')
					.setDescription('Note: If your conversion law is Ethnic Cleansing, start here at first!')
					.setValue('5')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Major Riots')
					.setDescription('Last level of riots before armed revolts begin! Beware!')
					.setValue('6')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Minor Armed Revolt')
					.setDescription('Note: If your conversion law is Extermination, start here at first!')
					.setValue('7')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Medium Armed Revolt')
					.setDescription('Second-to-last level of armed revolt before a revolution begins! Beware!')
					.setValue('8')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Major Armed Revolt')
					.setDescription('Last level of armed revolt before a revolution begins! Beware!')
					.setValue('9')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Revolution')
					.setDescription('Final Stage, if reached there is no going back. Civil War begins.')
					.setValue('10')
					.setEmoji('1313227590579916890')
			);

		const row = new ActionRowBuilder()
			.addComponents(selection);

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


		//await interaction.deferReply({ fetchReply: true, ephemeral: false });

		const response = await interaction.reply({ content: 'Select current stage of rebellion for the occupied pops!', components: [row] });
		const collectorFilter = i => i.user.id === interaction.user.id;
		const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, filter: collectorFilter, time: 60_000 });

		collector.on('collect', async i => { //when selection is collected...
			const selection = i.values[0];
			var selectionINT = Number(selection); //convert selection string to int
			var finalSelectionMessage = "";

			if (diceResultFinal == 1) {
				resultMessage = "CATASTROPHIC FAILURE";
				finalSelectionResult = selectionINT + 3;
			} else if (diceResultFinal >= 2 && diceResultFinal <= 4) {
				resultMessage = "FAILURE";
				finalSelectionResult = selectionINT + 2;
			} else if (diceResultFinal >= 5 && diceResultFinal <= 9) {
				resultMessage = "SLIGHT FAILURE";
				finalSelectionResult = selectionINT + 1;
			} else if (diceResultFinal >= 10 && diceResultFinal <= 14) {
				resultMessage = "SLIGHT SUCCESS";
				finalSelectionResult = selectionINT - 1;
			} else if (diceResultFinal >= 15 && diceResultFinal <= 19) {
				resultMessage = "SUCCESS";
				finalSelectionResult = selectionINT - 2;
			} else if (diceResultFinal >= 20) {
				resultMessage = "OVERWHELMING SUCCESS";
				finalSelectionResult = selectionINT - 3;
			}
			var negativeEmoji = '<:economic_downturn:1283459508986970233>';
			var positiveEmoji = '<:economic_upswing:1283459521833865318>';
			var messageEmoji = "";

			if (finalSelectionResult < 1) finalSelectionMessage = "Minor Protests";
			if (finalSelectionResult > selectionINT) {
				messageEmoji = negativeEmoji;
			} else {
				messageEmoji = positiveEmoji;
			}
			switch (finalSelectionResult) {
				case 1:
					finalSelectionMessage = "Minor Protests";
					break;
				case 2:
					finalSelectionMessage = "Medium Protests";
					break;
				case 3:
					finalSelectionMessage = "Major Protests";
					break;
				case 4:
					finalSelectionMessage = "Minor Riots";
					break;
				case 5:
					finalSelectionMessage = "Medium Riots";
					break;
				case 6:
					finalSelectionMessage = "Major Riots";
					break;
				case 7:
					finalSelectionMessage = "Minor Armed Revolt";
					break;
				case 8:
					finalSelectionMessage = "Medium Armed Revolt";
					break;
				case 9:
					finalSelectionMessage = "Major Armed Revolt";
					break;
				case 10:
					finalSelectionMessage = "Revolution";
					break;
			}
			switch (selectionINT) {
				case 1:
					selectionMessage = "Minor Protests";
					break;
				case 2:
					selectionMessage = "Medium Protests";
					break;
				case 3:
					selectionMessage = "Major Protests";
					break;
				case 4:
					selectionMessage = "Minor Riots";
					break;
				case 5:
					selectionMessage = "Medium Riots";
					break;
				case 6:
					selectionMessage = "Major Riots";
					break;
				case 7:
					selectionMessage = "Minor Armed Revolt";
					break;
				case 8:
					selectionMessage = "Medium Armed Revolt";
					break;
				case 9:
					selectionMessage = "Major Armed Revolt";
					break;
				case 10:
					selectionMessage = "Revolution";
					break;
			}
			//await interaction.defer({ fetchReply: true, ephemeral: false });

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
			`)
				.addFields({
					name: 'Rebellion Stages',
					value: `
			> <:exclamation:1283459533569527879> Rebellion Stage Before Roll: ${selectionMessage}
			> ${messageEmoji} Rebellion Stage After Roll: ${finalSelectionMessage}
			Player: <@${user.id}>`})
				.setFooter({ text: 'Note: Infamy Gain is only applied if someone finds out IRP, applied ONCE only.', iconURL: `${interaction.client.user.avatarURL()}` })
				.setThumbnail('https://pbs.twimg.com/media/FNp7AC7XEAE41zT.png:large');

			await interaction.editReply({ content: `${i.user} selected ${selectionMessage} successfully, calculating...`});
			await interaction.followUp({
				content: `
			# Final Result: ${diceResultFinal} | ${resultMessage}
			## NAT Result: ${diceResult}`,
				embeds: [conversionEmbed]
			});
			await interaction.editReply({ content: `Done!`, components: [] });
		});
		//await interaction.deferReply({ fetchReply: true, ephemeral: false });
		
	},
};
