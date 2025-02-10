const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'eventbuilder',
	description: 'Deploys a link to the Event Builder Website, for GM use only.',
	server: true,
	permissionsRequired: [PermissionFlagsBits.ViewAuditLog],
	callback: async (client, interaction) => {
		interaction.reply('> Event Builder: https://astralis-web.netlify.app/events');
	}
};