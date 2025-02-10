const { ActionRowBuilder, ApplicationCommandOptionType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ComponentType } = require('../../node_modules/discord-api-types/v10');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');

module.exports = {
	name: 'buytrait',
	description: 'Purchase traits for your nation leader! Only 1 leader per nation!',
	server: true,

	callback: async (client, interaction) => {
		const { user, member, message, channel } = interaction;
		const country = await getColorCode(member);

		channel.send(`Test: ${country.id}`);

		var prestigeBefore = await getData(country.id, 'prestige', 1);
		var prestigeAfter;
		var prestigeCost;
		var traits = [];


		const selection = new StringSelectMenuBuilder()
			.setCustomId('trait-selector')
			.setPlaceholder('Select the trait you want to purchase!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Caesar')
					.setDescription('Allows your character to have 4 traits instead of 2, not counting itself.')
					.setValue('Caesar')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Iron Heart')
					.setDescription('+2 vassal slots, +1 to vassal integration rolls.')
					.setValue('Iron Heart')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Paranoid')
					.setDescription('More likely to catch spy networks set inside of the country. ')
					.setValue('Paranoid')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Warhawk')
					.setDescription('Military tech can be adopted 2 years early instead of 1 year early.')
					.setValue('Warhawk')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Savvy Autocrat')
					.setDescription('Automatic internal support for all new policies, +2 pops converted per conversion roll')
					.setValue('Savvy Autocrat')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Figurehead')
					.setDescription('+2 buff to instability reduction rolls.')
					.setValue('Figurehead')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Technocrat')
					.setDescription('+1 tech roll per literacy tier.')
					.setValue('Technocrat')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Economist')
					.setDescription('+15% profit from all trade deals done in the free market.')
					.setValue('Economist')
					.setEmoji('1313227590579916890'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Diplomat')
					.setDescription('Easier time improving relations with other countries.')
					.setValue('Diplomat')
					.setEmoji('1313227590579916890'),
			);

		const row = new ActionRowBuilder()
			.addComponents(selection);

		const response = await interaction.reply({ content: 'Select the trait you want to purchase!', components: [row] });
		const collectorFilter = i => i.user.id === interaction.user.id;
		const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, filter: collectorFilter, time: 60_000 });

		collector.on('collect', async i => { //when selection is collected...
			const selection = i.values[0];

			switch (selection) {
				case 'Caesar':
					prestigeCost = 140;
					break;
				case 'Iron Heart':
					prestigeCost = 75;
					break;
				case 'Paranoid':
					prestigeCost = 50;
					break;
				case 'Warhawk':
					prestigeCost = 40;
					break;
				case 'Savvy Autocrat':
					prestigeCost = 40;
					break;
				case 'Figurehead':
					prestigeCost = 30;
					break;
				case 'Technocrat':
					prestigeCost = 30;
					break;
				case 'Economist':
					prestigeCost = 25;
					break;
				case 'Diplomat':
					prestigeCost = 20;
					break;
			}

			if (traits.includes(selection)) {
				await interaction.editReply(`You have already purchased the trait ${selection}!`);
				return;
			}

			if (prestigeBefore < prestigeCost) {
				await interaction.editReply(`You don't have enough prestige for that purchase! You have ${prestigeBefore} and the trait ${selection} costs ${prestigeCost}, try later!`);
				return;
			} else {
				prestigeAfter = prestigeBefore - prestigeCost;
				traits.push(selection);
				await setData(country.id, 'prestige', prestigeAfter);
				await setData(country.id, 'traits', traits);
				const conversionEmbed = new EmbedBuilder()
					.setColor(0x904f8d)
					.setTitle('<:arrow:1283459568621322393> TRAIT STORE')
					.setAuthor({ name: `${user.tag}`, iconURL: `${user.avatarURL()}` })
					.setDescription(`
					> <:cherry:1283459824209629347> Trait To Buy:  ${selection}
					> <:cherry:1283459824209629347> Prestige Before Purchase:  ${prestigeBefore}
					> <:cherry:1283459824209629347> Prestige After Purchase:  ${prestigeAfter}
					`)
					.setFooter({ text: 'Note: This is a test, no actual functionality has been added.', iconURL: `${interaction.client.user.avatarURL()}` });
					console.log(traits);

			await interaction.editReply({ content: `${i.user} selected ${selection} successfully, calculating...`});
			await interaction.followUp({
				embeds: [conversionEmbed]
			});
				await interaction.editReply({ content: `Done!`, components: [] });
			}
		});
	},
};
