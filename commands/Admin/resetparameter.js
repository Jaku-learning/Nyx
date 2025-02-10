const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');

module.exports = {
	name: 'resetparameters',
	description: 'Reset a database parameter! (DEV ONLY!)',
    server: true,
    devOnly: true,
    options: [
        {
            name: 'country-role',
            description: 'Target role',
            required: true,
            type: ApplicationCommandOptionType.Role,
        },
        {
            name: 'parameter',
            description: 'Target parameter',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async (client, interaction) => {

        const country = interaction.options.getRole('country-role');
        const param = interaction.options.getString('parameter');

        await interaction.deferReply({ ephemeral: false });
        try {
            await setData(country.id, param, null);
            await interaction.editReply(`Parameter ${param} reset successfully for ${country}!`);
        } catch (error) {
            await interaction.editReply(`Could not reset the parameter ${param} for ${country}! It either does not exist or something else happened, check: ${error}`);
        }
	}
};