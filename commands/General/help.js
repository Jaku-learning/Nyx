const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	name: 'help',
	description: 'Check every command this bot has to offer!',
	server: true,
	devOnly: false,
	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;

		const commandFolders = fs.readdirSync('./commands').filter(folder => 
			!folder.startsWith('.'));
		const commandsByCategory = {};

		for (const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('js'));
			const commands = [];

			for (const file of commandFiles) {
				const { default: command } = await import(`./../${folder}/${file}`);
				commands.push({ name: command.name, description: command.description });
			}

			commandsByCategory[folder] = commands;
		}
		const dropdownMenu = Object.keys(commandsByCategory).map(folder => ({
			label: folder,
			value: folder
		}));

		const selectMenu = new StringSelectMenuBuilder()
			.setCustomId('help-selector')
			.setPlaceholder('Select a command category!')
			.addOptions(...dropdownMenu.map(option => ({
				label: option.label,
				value: option.value
			})));

		const helpEmbed = new EmbedBuilder()
			.setTitle('Help Lounge')
			.setColor(0x904f8d)
			.setDescription(`Hi! Welcome to Nyx's' user aid menu, please select a category from the dropdown menu to view our commands by category. If you face any issues whilst using them or have feedback for the staff, let us know with a comment or by opening a support ticket in the <#1283125076102742036> channel, thank you!`)
			.setImage('https://cdn.discordapp.com/attachments/1186041030739492885/1284333631644635269/Bannerastralis.png?ex=679d80e7&is=679c2f67&hm=94c63410cb35d3d9da921c334eb0795f63e5551a3357e3e8ac1fafcb84fd05e2&')
			.setThumbnail(`${user.displayAvatarURL()}`)
			.setFooter({ text: 'Nyx version 0.3a' })
			.setTimestamp()

		const row = new ActionRowBuilder()
			.addComponents(selectMenu)

		await interaction.reply({ embeds: [helpEmbed], components: [row] });

		const filter = i => i.isStringSelectMenu() && i.customId === 'help-selector';
		const collector = interaction.channel.createMessageComponentCollector({
			filter: filter
		});

		collector.on('collect', async i => {
			const selectedCategory = i.values[0];
			const categoryCommands = commandsByCategory[selectedCategory];

			const categoryEmbed = new EmbedBuilder()
				.setTitle(`${selectedCategory} Commands`)
				.setColor(0x904f8d)
				.setDescription(`List of all the commands present in this category, some are WIP!`)
				.setImage('https://cdn.discordapp.com/attachments/1186041030739492885/1284333631644635269/Bannerastralis.png?ex=679d80e7&is=679c2f67&hm=94c63410cb35d3d9da921c334eb0795f63e5551a3357e3e8ac1fafcb84fd05e2&')
				.setThumbnail(`${user.displayAvatarURL()}`)
				.addFields(categoryCommands.map(command => ({
					name: command.name,
					value: command.description
				})));
			await i.update({ embeds: [categoryEmbed] });
		})
	},
};