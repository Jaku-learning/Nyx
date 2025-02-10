const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');

module.exports = {
	name: 'leaderprofile',
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
		const traits = `${await getData(country.id, 'traits', 'No Traits')}`

		await interaction.deferReply({ ephemeral: false });
		const customizationEmbed = new EmbedBuilder()
            .setColor(`${country.hexColor}`)
            .setTitle('<:gift:1283459546253103174> NATION LEADER SCREEN')
            .setAuthor({ name: `${country.name}`, iconURL: `${user.avatarURL()}` })
            .setDescription(`
            Player: <@${user.id}>
            ‎`)
            .addFields({
                name: '◇──◇Personal Information◇──◇', value: `
                **Name:** ${leaderName}

                **Background:** ${leaderDescription}

                **Age:** ${leaderAge}
                ‎ 
                `, })
            .addFields({
                name: '◇──◇Additional Information◇──◇', value: `
                **Gender:** ${leaderGender}
                
                **Titles:** ${leaderTitles}
                ‎ 
                `, })
            .addFields({
                name: '◇──◇Traits◇──◇', value: `
                ${traits}
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