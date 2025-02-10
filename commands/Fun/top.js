const { SlashCommandBuilder, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

module.exports = {
	cooldown: 10,
	name: ('top'),
	description: ('Show them who´s the boss here!'),
	server: true,
	options: [
		{
			name: 'bottom',
			description: 'Name of the bottom! Tag them!',
			type: ApplicationCommandOptionType.Mentionable,
			required: true,
		},
	],

	callback: async (client, interaction) => { 
		const { user, member, channel } = interaction;
		const canvas = Canvas.createCanvas(2048, 1582); //image size
		const ctx = canvas.getContext('2d');
		const bottomAvatar = interaction.options.getUser('bottom');
		const avatarBottomURL = bottomAvatar.displayAvatarURL({ dynamic: true, format: 'png', size: 256 });
		const avatarTopURL = user.displayAvatarURL({ dynamic: true, format: 'png', size: 256 });


		const bg = await Canvas.loadImage('./resources/topchair.jpg'); //load bg

        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height); //draw image with bg

		//Image border
		ctx.strokeStyle = '#0099ff';
		ctx.strokeRect = (0, 0, canvas.width, canvas.height);

		//Command target profile picture draw
		const avatarBottom = await Canvas.loadImage(avatarBottomURL);
		const avatarTop = await Canvas.loadImage(avatarTopURL);

		ctx.drawImage(avatarBottom, 1146, 147, 500, 500);
		ctx.drawImage(avatarTop, 400, 58, 400, 400);

		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'topping-image.png' });

		await interaction.deferReply({ ephemeral: false });
		await interaction.editReply({
			content: `<@${bottomAvatar.id}> has been dommed by <@${user.id}>!`, files: [attachment]
		});
	}
};