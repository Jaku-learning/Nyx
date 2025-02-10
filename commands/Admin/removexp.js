const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');
module.exports = {
	name: 'removexp',
	description: 'Remove xp to someone`s intelligence agency',
    server: true,
    permissionsRequired: [PermissionFlagsBits.ViewAuditLog],
    options: [
        {
            name: 'country',
            description: 'The country´s leader role.',
            required: true,
            type: ApplicationCommandOptionType.Role,
        },

        {
            name: 'removed-xp',
            description: 'Raw XP value that will be removed.',
            required: true,
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
        },
    ],

    callback: async (client, interaction) => {
		const { user, member, message, channel } = interaction;
        const country = interaction.options.getRole('country');

        const countryMaxXP = await getData(country.id, 'intelagencyxpneed', 1);

        const xpToRemove = interaction.options.getInteger('removed-xp');

        await interaction.deferReply({ ephemeral: false });

        if (xpToRemove > countryMaxXP) {
            channel.send(`Removing this amount of XP is not possible as the country only has ${countryMaxXP} as this level's maximum value. Try again!`);
        }
        
        
        await addData(country.id, 'intelagencyxp', -xpToRemove);
        await interaction.editReply(`You have successfully removed ${xpToRemove}xp to ${country}'s intelligence agency!`)
        
	}
};