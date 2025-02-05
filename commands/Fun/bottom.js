const { SlashCommandBuilder, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

module.exports = {
	cooldown: 10,
	name: ('bottom'),
	description: ('Show that femboy!'),
	server: true,
	options: [
		{
			name: 'femboy',
			description: 'Name of the femboy! Tag them!',
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
	],

	callback: async (client, interaction) => { 
		const { user, member, channel } = interaction;
		const canvas = Canvas.createCanvas(850, 1211); //image size
		const ctx = canvas.getContext('2d');
		const femboyAvatar = interaction.options.getUser('femboy');
		const avatarURL = femboyAvatar.displayAvatarURL({ dynamic: true, format: 'png', size: 256 });
		//const circle = { x: canvas.width / 2, y: canvas.height /2, radius: 70, }

		// ctx.fileStyle = 'white';

		const bg = await Canvas.loadImage('./resources/femboy.jpg'); //load bg

		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height); //draw image with bg


		//Image border
		ctx.strokeStyle = '#0099ff';
		ctx.strokeRect = (0, 0, canvas.width, canvas.height);

		//Command target profile picture draw
		const { body } = await request(avatarURL);

		//Turn avatar into a circle
		/*ctx.beginPath();
		ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();*/
		const avatar = await Canvas.loadImage(await body.arrayBuffer());

		/*/const aspect = avatar.height / avatar.width;
		const hsx = circle.radius * Math.max(1.0 / aspect, 1.0)
		const hsy = circle.radius * Math.max(aspect, 1.0)*/

		ctx.drawImage(avatar, 112, 290, 200, 200);

		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'femboy-image.png' });

		await interaction.deferReply({ ephemeral: true });
		channel.send({
			content: `<@${femboyAvatar.id}> is a cute femboy :3`, files: [attachment]
		});
	}
};