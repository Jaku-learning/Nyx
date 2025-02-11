const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode.js');

module.exports = {
	name: 'mynetworks',
	description: 'Check all your currently active spy networks, and information on their status!',
	server: true,

	callback: async (client, interaction) => {
		const { user, member, message, channel } = interaction;

		const attackerCountry = await getColorCode(member);
		var existingNetworks = [`${await getData(attackerCountry.id, 'friendlynetworks', [])}`]
		var agencyLevel = await getData(attackerCountry.id, 'intelagencylevel', 1);
		
		//var friendlyNetworks = Array.isArray(existingNetworks) ? existingNetworks : [];
		//var val = existingNetworks.trim();
		
		
		//existingNetworks.forEach(network => console.log(network.location));
		//var existingNetworks = val ? existingNetworks.split(",") : [];
		console.log(existingNetworks)
		//console.log(friendlyNetworks)
		var networks = [];

		/*for (var i = 0; i < Object.keys(existingNetworks).length; i++) {
			var id = existingNetworks[i]['id'];
			let obj = { date: id.date || "Unknown", location: id.location || "Unknown" };
			networks.push(obj);
			console.log(obj);
		}*/


		/*var friendlyNetworks = [ {
			locations: val ? existingNetworks.split(",").location : [],
			dates: val ? existingNetworks.split(",").date : [],
		}]

		console.log(friendlyNetworks)*/

		/*var networks = [];
			for (const network of existingNetworks) {
				let obj = { date: network.date || "Unknown", location: network.location || "Unknown" };
				networks.push(obj);
				console.log(obj);
		}*/
		
		/*existingNetworks.map(network => (
			`${console.log(network.location)}`
		));*/

		var fNetworks = [];
		//var indexZero = existingNetworks.indexOf(0);

		for (const network of existingNetworks) {
			//if (indexZero > -1) { fNetworks.splice(indexZero, 1); }
				fNetworks.push({ date: network.date, location: network.location });
				console.log(fNetworks);
        }
			
		var networkCap = 1;

		var usedSlots = Object.keys(existingNetworks).length;

		if (agencyLevel >= 5 && agencyLevel <= 9) { networkCap = 2 }
		else if (agencyLevel >= 10 && agencyLevel <= 14) { networkCap = 3 }
		else if (agencyLevel >= 15 && agencyLevel <= 19) { networkCap = 4 }
		else if (agencyLevel >= 20 && agencyLevel <= 25) { networkCap = 5 }
        
		const networksEmbed = new EmbedBuilder()
			.setColor(0x904f8d)
			.setTitle('<:arriba:1277991305716432947> SPY NETWORKS VISUALIZER')
			.setAuthor({ name: `${attackerCountry.name}`, iconURL: `${user.avatarURL()}` })
			.setDescription(`
			> <:light:1283459592994553989> Network Slots:  ${usedSlots} out of ${networkCap} used.
			> <:bang:1277980082790469695> Agency Level: ${agencyLevel}
			Player: <@${user.id}>`)
			.setThumbnail('https://pbs.twimg.com/media/FNp7AC7XEAE41zT.png:large');
		if (existingNetworks != null) {
			networksEmbed.addFields(
				fNetworks.map((network) => (console.log(network.location), {
					name: `Network Slot TEST ${fNetworks.indexOf(network) + 1}`, value:
						`Location: <@&${network.location}>
						Network Active Since: ${network.date}
			` })));			
			/*friendlyNetworks.forEach(network => {
				networksEmbed.addFields({
					name: `Network Slot ${friendlyNetworks.indexOf(network) + 1}`, value:
						`Location: <@&${network.location}>
						Network Active Since: ${network.date}
			` });
		});*/
		} else {
			networksEmbed.addFields({ name: `Empty Network Slot`, value: `No Active Network!` });
		}
		await interaction.deferReply({ ephemeral: false });
		await interaction.editReply({ embeds: [networksEmbed] })
	}
};