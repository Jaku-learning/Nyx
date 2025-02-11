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
		var attackerAgencyLevel = await getData(attackerCountry.id, 'intelagencylevel', 1);

		var chances = 1;

		var friendlyNetworkLocations = []
		var friendlyNetworkYears = []
		var friendlyNetworkChances = []
		var enemyNetworkLocations = []
		var enemyNetworkYears = []
		var enemyNetworkChances = []

		var networkCap = 1;
		if (attackerAgencyLevel >= 5 && attackerAgencyLevel <= 9) { networkCap = 2 }
		else if (attackerAgencyLevel >= 10 && attackerAgencyLevel <= 14) { networkCap = 3 }
		else if (attackerAgencyLevel >= 15 && attackerAgencyLevel <= 19) { networkCap = 4 }
		else if (attackerAgencyLevel >= 20 && attackerAgencyLevel <= 25) { networkCap = 5 }

		for (i = 0; i < networkCap; i++) {

			//FRIENDLY
			friendlyNetworkLocations.push(`${await getData(targetCountry.id, `network_${i}_value`, "")}`)

			
			friendlyNetworkYears.push(`${await getData(targetCountry.id, `network_${i}_year`, "")}`)

			
			friendlyNetworkChances.push(`${await getData(targetCountry.id, `network_${i}_chance`, "")}`)

			//ENEMY
			
			enemyNetworkLocations.push(`${await getData(attackerCountry.id, `e_network_${i}_value`, "")}`)

			
			enemyNetworkYears.push(`${await getData(attackerCountry.id, `e_network_${i}_year`, "")}`)

			
			enemyNetworkChances.push(`${await getData(attackerCountry.id, `e_network_${i}_chance`, "")}`)

			//var existingEnemyNetworks = await getData(targetCountry.id, 'enemynetworks', [])

			console.log(`Locations: ${friendlyNetworkLocations[i]} / Years: ${friendlyNetworkYears[i]} / Probabilities of Capture: ${friendlyNetworkChances[i]}`);
		}

		var usedSlotsF = friendlyNetworkLocations.length - networkCap;
		console.log(usedSlotsF)
		var eNetworkSlots = enemyNetworkLocations.length - networkCap;

		

		await interaction.deferReply({ ephemeral: false });

		if (targetCountry == attackerCountry) { interaction.editReply('You can´t set a spy network on yourself, try again!'); return; }
		if (friendlyNetworkLocations.includes(targetCountry.id)) { interaction.editReply(`You already have a spy network on ${targetCountry}, try again!`); return; }

		if (!(usedSlotsF >= networkCap)) {
			for (i = 0; i < (usedSlotsF + 1); i++) {
				if (friendlyNetworkLocations[i] == [] || friendlyNetworkLocations[i] == null) {
					/*friendlyNetworkLocations[i].push(targetCountry.id);
					friendlyNetworkYears[i].push(setYear);
					friendlyNetworkChances[i].push(1);*/
					/*friendlyNetworkLocations.splice(i, 0, targetCountry.id);
					friendlyNetworkYears.splice(i, 0, setYear);
					friendlyNetworkChances.splice(i, 0, 1);*/
					await setData(attackerCountry.id, `network_${i}_value`, targetCountry.id);
					await setData(attackerCountry.id, `network_${i}_year`, setYear);
					await setData(attackerCountry.id, `network_${i}_chance`, chances);
					await channel.send(`DEV DATA >>> Location: ${targetCountry.id} / Year: ${setYear} / Probability of Capture: ${chances}`);
				}
				
			for (i = 0; i < eNetworkSlots; i++) {
				if (enemyNetworkLocations[i] != [] || enemyNetworkLocations[i] != null) {
					/*enemyNetworkLocations[i].push(attackerCountry.id);
					enemyNetworkYears[i].push(setYear);
					enemyNetworkChances[i].push(1);*/
					/*enemyNetworkLocations.splice(i, 0, attackerCountry.id);
					enemyNetworkYears.splice(i, 0, setYear);
					enemyNetworkChances.splice(i, 0, 1);*/
					await setData(targetCountry.id, `e_network_${i}_value`, attackerCountry.id);
					await setData(targetCountry.id, `e_network_${i}_year`, setYear);
					await setData(targetCountry.id, `e_network_${i}_chance`, chances);
				}
			}
		}
		} else if (usedSlotsF >= networkCap) { interaction.editReply(`You have already reached the spy network cap with your current agency level! Remove a spy network using /removenetwork or wait until you level up to increase the cap to set a network in ${targetCountry}!`); return; }
			
		/*var targetAgencyLevel = await getData(targetCountry.id, 'intelagencylevel', 1);
	

		if (existingNetworks.includes('No Networks Set')) { existingNetworks = []; }
		if (existingEnemyNetworks.includes('No Enemy Networks')) { existingEnemyNetworks = [] }

		var valExisting = existingNetworks.trim();
		var friendlyNetworks = valExisting ? existingNetworks.split(",") : [];

		var valEnemy = existingEnemyNetworks.trim();
		var enemyNetworks = valEnemy ? existingEnemyNetworks.split(",") : [];

		var friendlyNetworks = Array.isArray(existingNetworks) ? existingNetworks : [];
		var enemyNetworks = Array.isArray(existingEnemyNetworks) ? existingEnemyNetworks : [];
		
		 friendlyNetworks.push({
			date: setYear,
			location: targetCountry.id,
		});

		enemyNetworks.push ({
			date: setYear,
			culprit: attackerCountry.id,
		})  
		
		*/

		
		//channel.send(`Networks: ${existingNetworks}`);

	    await interaction.editReply(`Network successfully infiltrated in ${targetCountry}!`);
	
	}
};