const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');

module.exports = {
	name: 'leaderprofilenew',
	description: 'Shows the nation leader´s profile information!',
	server: true,
	callback: async (client, interaction) => {
 		const { user, member, channel } = interaction;

		const country = await getColorCode(member);
		const leaderName = await getData(country.id, 'leader_name', 'Unknown');
		const leaderDescription = await getData(country.id, 'description', 'Unknown');
		const leaderAge = await getData(country.id, 'age', 'Unknown');
		var leaderPortrait = await getData(country.id, 'portrait', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Gamla_Stan%2C_S%C3%B6dermalm%2C_Stockholm%2C_Sweden_-_panoramio_%28217%29.jpg/1200px-Gamla_Stan%2C_S%C3%B6dermalm%2C_Stockholm%2C_Sweden_-_panoramio_%28217%29.jpg');
		var leaderTitles = await getData(country.id, 'titles', 'No Titles');
        var leaderGender = await getData(country.id, 'gender', 'Unspecified');
        var leaderHeight = await getData(country.id, 'height', 'Unspecified');
        var leaderWeight = await getData(country.id, 'weight', 'Unspecified');
        var leaderRace = await getData(country.id, 'race', 'Unspecified');

		const traits = `${await getData(country.id, 'traits', 'No Traits')}`
        var valExisting = traits.trim();
		var traitsFixed = valExisting ? traits.split(", ") : [];

		await interaction.deferReply({ ephemeral: false });
		const customizationEmbed = new EmbedBuilder()
            .setColor(`${country.hexColor}`)
            .setTitle(`<:crown:1283459679682564268> NATION LEADER: ${leaderName}`)
            .setAuthor({ name: `${country.name}`, iconURL: `${user.avatarURL()}` })
            .setDescription(`
            Player: <@${user.id}>
            ‎`)
            .addFields({
                name: '◇──◇ <:gift:1283459546253103174> Personal Information <:gift:1283459546253103174> ◇──◇', value: `
                <:information:1283459611696824453> **Name:** ${leaderName}
                <:information:1283459611696824453> **Background:** ${leaderDescription}
                <:information:1283459611696824453> **Age:** ${leaderAge}
                <:information:1283459611696824453> **Gender:** ${leaderGender}
                ‎ 
                `, })
            .addFields({
                name: '◇──◇ <a:bunny:1283459810662289529> Additional Information <a:bunny:1283459810662289529> ◇──◇', value: `
                <:mag:1277980019615858698> **Height:** ${leaderHeight}cm
                <:mag:1277980019615858698> **Weight:** ${leaderWeight}kg
                <:mag:1277980019615858698> **Race:** ${leaderRace}
                <:mag:1277980019615858698> **Titles:** ${leaderTitles}
                ‎ 
                `, })
            .addFields({
                name: '◇──◇ <:coin:1283459688511311944> Traits <:coin:1283459688511311944> ◇──◇', value: `
                ${traitsFixed}
                ‎ 
                `, })
            .setImage(`${leaderPortrait}`);
		
		if (country.icon != null) {
            customizationEmbed.setThumbnail(`${country.iconURL()}`);
        } else {
            customizationEmbed.setThumbnail(`${user.displayAvatarURL()}`);
		}
		
		interaction.editReply( { embeds: [customizationEmbed], } )
	}
};