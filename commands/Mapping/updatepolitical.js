const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

module.exports = {
	name: 'updatepolitical',
	description: 'Update the internal map in the bot! ADMIN ONLY!',
	server: true,
	permissionsRequired: [PermissionFlagsBits.ManageChannels],
	options: [
		{
			name: 'updated-map',
			description: '`Upload the new political map!`',
			required: true,
			type: ApplicationCommandOptionType.Attachment,
		},
	],

	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;
		const newMap = interaction.options.getAttachment('updated-map');
		const canvas = Canvas.createCanvas(2000, 1250); //image size
		const ctx = canvas.getContext('2d');
		const mapName = newMap.name;
		const mapURL = newMap.url;
		const proxyMapURL = newMap.proxyURL;

		const newMapURL = await Canvas.loadImage(mapURL)
		const oldMap = await Canvas.loadImage('./resources/map.png')

		ctx.drawImage(newMapURL, 0, 0, canvas.width, canvas.height);

		const attachmentNew = new AttachmentBuilder(await canvas.encode('png'), { name: 'map-political-new.png' });

		ctx.drawImage(oldMap, 0, 0, canvas.width, canvas.height);

		const attachmentOld = new AttachmentBuilder(await canvas.encode('png'), { name: 'map-political-old.png' });

		await interaction.deferReply({ fetchReply: true, ephemeral: true });

		channel.send({ content: `This command is not functional yet as I do not have a database! However, if it had one, it would have uploaded this map file with name ${mapName} to the database: `, files: [attachmentNew] });

		channel.send({ content: `This was the old map `, files: [attachmentOld] });

	}
};