const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

module.exports = {
		name: 'map',
		description: 'Spread the political map whenever you need to consult it!',

	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;
		const canvas = Canvas.createCanvas(2000, 1250); //image size
		const ctx = canvas.getContext('2d');
		const avatarURL = user.displayAvatarURL({ dynamic: true, format: 'png', size: 256 });

		//const circle = { x: canvas.width / 2, y: canvas.height /2, radius: 70, }

		// ctx.fileStyle = 'white';

		const bg = await Canvas.loadImage('./resources/map.png'); //load bg
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
		//Image border
		ctx.strokeStyle = '#0099ff';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		//Command target profile picture draw
		const { body } = await request(avatarURL);

		const avatar = await Canvas.loadImage(await body.arrayBuffer());

		ctx.drawImage(avatar, 2000, 0, 150, 150);
		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'map-strategic.png' });

		await interaction.deferReply({ ephemeral: true });
		channel.send({
			content: `<@${user.id}> has spread the political map!`, files: [attachment]
		});
	}
};
