const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');

module.exports = {
	name: 'haltspynetwork',
	description: 'Remove a spy network you have within another country!',
	server: true,
	options: [
		{
			name: 'target-country',
			description: 'Tag the role of the country where you want to remove the network.',
			required: true,
			type: ApplicationCommandOptionType.Role,
		},
	],

	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;
		const targetCountry = interaction.options.getRole('target-country');
		const setYear = await getData('1202015130565750795', 'year', 9999);
		const attackerCountry = await getColorCode(member);
        var existingNetworks = await getData(attackerCountry.id, 'friendlynetworks', []);
        var existingEnemyNetworks = await getData(targetCountry.id, 'enemynetworks', []);
		var attackerAgencyLevel = await getData(attackerCountry.id, 'intelagencylevel', 1);
		var targetAgencyLevel = await getData(targetCountry.id, 'intelagencylevel', 1);

		/*var valExisting = existingNetworks.trim();
		var friendlyNetworks = valExisting ? existingNetworks.split(",") : [];

		var valEnemy = existingEnemyNetworks.trim();
        var enemyNetworks = valEnemy ? existingEnemyNetworks.split(",") : [];*/

        var fNetworks = [];
			for (const network of existingNetworks) {
				fNetworks.push({ date: network.date, location: network.location });
				//console.log(fNetworks);
        }
        var eNetworks = [];
			for (const network of existingEnemyNetworks) {
				eNetworks.push({ date: network.date, culprit: network.culprit });
				//console.log(eNetworks);
			}
	
		var usedSlots = Object.keys(existingNetworks).length;

		await interaction.deferReply({ ephemeral: false });

        if (targetCountry == attackerCountry) { interaction.editReply('You can´t remove a spy network on yourself, try again!'); return; }
        var stop = false;
        var correct;

        fNetworks.map(async (network) => {
            console.log(network.location);
            if (network.location == targetCountry.id) {
                correct = targetCountry.id;
                return;
            } else if (network.location != targetCountry.id) {
            return;
        }
        });

        if (correct != targetCountry.id) {
            await interaction.editReply(`You don't have a spy network on ${targetCountry}, try again!`);
            return;
        }
        
        if (usedSlots == 0) { interaction.editReply(`You have NO spy networks to remove!`); return; }
        
        fNetworks.map(async (networkF) => {
            var finalFriendlyNetworks = fNetworks.filter(function (network) {
                    return network !== networkF;
            });
            await setData(attackerCountry.id, 'friendlynetworks', finalFriendlyNetworks);
        });
             
        
        fNetworks.map(async (networkE) => {
            var finalEnemyNetworks = eNetworks.filter(function (network) {
                    return network !== networkE;
              });
            await setData(targetCountry.id, 'enemynetworks', finalEnemyNetworks);
        });
             

              
        
        	


		await interaction.editReply(`Network in ${targetCountry} successfully removed!`);
        
	}
};