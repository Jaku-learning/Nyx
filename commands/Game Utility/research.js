const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');

module.exports = {
	name: 'research',
	description: 'Research anything you want in a quick and easy way!',
	server: true,
	options: [
		{
			name: 'tech-name',
			description: 'Name of the technology you want to research!',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'tier',
			description: 'Technological tier of this item! Check the guides if unsure.',
			required: true,
			type: ApplicationCommandOptionType.Integer,
			choices: [
				{ name: 'Tier I', value: 1 },
				{ name: 'Tier II', value: 2 },
				{ name: 'Tier III', value: 3 },
			]
		},
		{
			name: 'investment',
			description: 'Amount of points you want to invest!',
			required: true,
			type: ApplicationCommandOptionType.Integer,
			min_value: 1,
		},
		{
			name: 'previous-progress',
			description: 'Amount of points you have already invested, put 0 if none!',
			required: true,
			type: ApplicationCommandOptionType.Integer,
			min_value: 0,
		},
	],

	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;
		const country = await getColorCode(member);
		const researchPoints = await getData(country.id, 'researchpoints', 0);
		const technology = interaction.options.getString('tech-name');
		const tier = interaction.options.getInteger('tier');
		const investment = interaction.options.getInteger('investment');
		const previousInvestment = interaction.options.getInteger('previous-progress');
		var totalInvestment = investment + previousInvestment;
		var techCost = 0;

		switch (tier) {
			case 1:
				interaction.reply("Tier I tech does not require research! If you want to research something, make sure it's tier II or tier III. Check <#1310344367273410660> for more information.")
				return;
			case 2:
				techCost = 3500;
				break;
			case 3:
				techCost = 12500;
				break;
		}

		//if ((investment + previousInvestment) >= techCost) { totalInvestment = techCost; }

		const researchEmbed = new EmbedBuilder()
			.setColor(0x904f8d)
			.setTitle('<:arriba:1277991305716432947> RESEARCH LAB PROGRESS')
			.setAuthor({ name: `${country.name}`, iconURL: `${user.avatarURL()}` })
			.setDescription(`
			> <:light:1283459592994553989> Research Points in Storage Before:  ${researchPoints}
			> <:light:1283459592994553989> Research Points in Storage After:  ${researchPoints-investment}
			> <:bang:1277980082790469695> Technology Name: ${technology}
			> <:cherry:1283459824209629347> Technological Tier:  ${tier}
			> <:cherry:1283459824209629347> Research Progress: ${totalInvestment} out of ${techCost}
			Player: <@${user.id}>`)
			.setImage('https://cdn.discordapp.com/attachments/1283216596571262997/1283216596860407828/TechBannerIMG.png?ex=67a7f115&is=67a69f95&hm=c3e07bbff2ae43e5b3995b8d3180555bcd7441e26c98d9f5eb8f5f9290e09172&')
			.setThumbnail('https://pbs.twimg.com/media/FNp7AC7XEAE41zT.png:large');

		const finishEmbed = new EmbedBuilder()
			.setColor(0x90EE90)
			.setTitle('<:arriba:1277991305716432947> RESEARCH COMPLETE!')
			.setAuthor({ name: `${country.name}`, iconURL: `${user.avatarURL()}` })
			.setDescription(`
			> <:light:1283459592994553989> Research Points in Storage: ${researchPoints-investment}
			> <:bang:1277980082790469695> Completed Tech: ${technology}`)

			.setThumbnail('https://pbs.twimg.com/media/FNp7AC7XEAE41zT.png:large');
		
		await interaction.deferReply({ ephemeral: false });

		if (investment > researchPoints) {
			await interaction.editReply(`You don't have enough research points to invest that much! You have ${researchPoints} and tried to invest ${investment}, try again!`);
			return;
		}
		
		if (totalInvestment >= techCost) {
			let remnant = totalInvestment - techCost;
			await addData(country.id, 'researchpoints', -investment);
			await addData(country.id, 'researchpoints', remnant);
			await interaction.editReply({ content: `You finished this technology with ${remnant} research points leftover, in addition to whatever remains in your storage!`, embeds: [researchEmbed, finishEmbed] });
		} else if (totalInvestment < techCost) {
			let remnantInter = researchPoints - investment;
			await setData(country.id, 'researchpoints', remnantInter);
			await interaction.editReply({ embeds: [researchEmbed] });
		}

	}
};
