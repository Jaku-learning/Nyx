const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');
module.exports = {
	name: 'addxp',
	description: 'Add xp to someone`s intelligence agency',
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
            name: 'reason',
            description: 'Reason for the XP gain.',
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'Overwhelming SpyOp Success', value: 'op-ov-success', },
                { name: 'SpyOp Success', value: 'op-success', },
                { name: 'Slight SpyOp Success', value: 'op-sli-success', },
                { name: 'Slight SpyOp Failure', value: 'op-sli-fail', },
                { name: 'SpyOp Failure', value: 'op-fail', },
                { name: 'Overwhelmig SpyOp Failure', value: 'op-ov-fail', },
                { name: 'Missing Raw XP', value: 'raw-xp', },
            ],
        },
        
        {
            name: 'year',
            description: 'Year when the operation was conducted',
            required: true,
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
        },

        {
            name: 'missing-raw-xp',
            description: 'Raw XP value that might have been missing from previous use.',
            required: false,
            type: ApplicationCommandOptionType.Integer,
            min_value: 0,
        },
    ],

    callback: async (client, interaction) => {
		const { user, member, message, channel } = interaction;
        const country = interaction.options.getRole('country');
        const opResult = interaction.options.getString('reason');
        const year = interaction.options.getInteger('year');

        const countryMaxXP = await getData(country.id, 'intelagencyxpneed', 1);
        const xpMissingRaw = interaction.options.getInteger('missing-raw-xp');

        var xpTotal;
        var remainingXP;

        await interaction.deferReply({ ephemeral: false });

        /*if (getColorCode(country) == null) {
            await interaction.reply('This is not a country leader role, you can only add XP to country leader roles! Try again!')
        }*/

        switch (opResult) {
            case 'op-ov-success':
                xpTotal = 500;
                break;
            case 'op-success': 
                xpTotal = 400;
                break;
            case 'op-sli-success':
                xpTotal = 300;
                break;
            case 'op-sli-fail':
                xpTotal = 200;
                break;
            case 'op-fail':
                xpTotal = 100;
                break;
            case 'op-ov-fail':
                xpTotal = 50;
                break;
            case 'raw-xp':
                xpTotal = xpMissingRaw;
                break;
        }

        if (xpTotal > countryMaxXP) {
            remainingXP = xpTotal - countryMaxXP;
            channel.send(`Adding this amount of XP leaves ${remainingXP}xp as leftovers, since the required XP to level up is less than the XP that was gained, you will have to add this missing amount yourself, copy and paste the command below:`);
            channel.send(`/addxp country:${country} reason:Missing Raw XP year:${year} missing-raw-xp:${remainingXP}`);
        }
        
        if (xpMissingRaw < 1 && opResult == 'raw-xp') {
            await interaction.editReply('You selected the reason `Missing Raw XP` but did not add a value the option `missing-raw-xp`, please try again.');

        } else if (xpMissingRaw >= 1 && opResult != 'raw-xp') {
            await interaction.editReply('You added a value to the `missing-raw-xp` option but did not select the `Missing Raw XP` option, please try again.');
        } else {
            await addData(country.id, 'intelagencyxp', xpTotal);
            await interaction.editReply(`You have successfully added ${xpTotal}xp to ${country}'s intelligence agency! Reason: ${opResult}`)
        }
	}
};