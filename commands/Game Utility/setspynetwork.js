const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');

module.exports = {
	name: 'setspynetwork',
	description: 'Set a spy network within another country. Has a chance of getting caught every year!',
	server: true,
	options: [
		{
			name: 'target-country',
			description: 'Tag the role of the country you want to set the network on. Beware, it can be caught with time!',
			required: true,
			type: ApplicationCommandOptionType.Role,
		},
	],

	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;
		const targetCountry = interaction.options.getRole('target-country');
		const setYear = await getData('server', 'year', 9999);
		const attackerCountry = await getColorCode(member);
		var existingNetworks = await getData(attackerCountry.id, 'friendlynetworks', [])
		var existingEnemyNetworks = await getData(targetCountry.id, 'enemynetworks', [])
		var attackerAgencyLevel = await getData(attackerCountry.id, 'intelagencylevel', 1);
		//var targetAgencyLevel = await getData(targetCountry.id, 'intelagencylevel', 1);

		//if (existingNetworks.includes('No Networks Set')) { existingNetworks = []; }
		//if (existingEnemyNetworks.includes('No Enemy Networks')) { existingEnemyNetworks = [] }

		/*var valExisting = existingNetworks.trim();
		var friendlyNetworks = valExisting ? existingNetworks.split(",") : [];

		var valEnemy = existingEnemyNetworks.trim();
		var enemyNetworks = valEnemy ? existingEnemyNetworks.split(",") : [];*/
		var friendlyNetworks = [];
		var enemyNetworks = [];
		var networkCap = 1;

		var usedSlots = friendlyNetworks.length;

		const friendlyNetworkObject = {
			date: setYear,
			location: targetCountry.id,
		}

		const enemyNetworkObject = {
			date: setYear,
			culprit: attackerCountry.id,
		}

		
		//channel.send(`Networks: ${existingNetworks}`);

		if (attackerAgencyLevel >= 5 && attackerAgencyLevel <= 9) { networkCap = 2 }
		else if (attackerAgencyLevel >= 10 && attackerAgencyLevel <= 14) { networkCap = 3 }
		else if (attackerAgencyLevel >= 15 && attackerAgencyLevel <= 19) { networkCap = 4 }
		else if (attackerAgencyLevel >= 20 && attackerAgencyLevel <= 25) { networkCap = 5 }

		await interaction.deferReply({ ephemeral: false });

		if (targetCountry == attackerCountry) { interaction.editReply('You can´t set a spy network on yourself, try again!'); return; }
		if (existingNetworks.includes(targetCountry.id)) { interaction.editReply(`You already have a spy network on ${targetCountry}, try again!`); return; }
		if (usedSlots >= networkCap) { interaction.editReply(`You have already reached the spy network cap with your current agency level! Remove a spy network using /removenetwork or wait until you level up to increase the cap to set a network in ${targetCountry}!`); return; }
		
		friendlyNetworks.push({ date: friendlyNetworkObject.date, location: friendlyNetworkObject.location });
		enemyNetworks.push({ date: enemyNetworkObject.date, culprit: enemyNetworkObject.culprit });

		await addData(attackerCountry.id, 'friendlynetworks', friendlyNetworks);
		await addData(targetCountry.id, 'enemynetworks', enemyNetworks);

		await interaction.editReply(`Network successfully infiltrated in ${targetCountry}!`);
	}
};