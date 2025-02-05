const { SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

module.exports = {
	name: 'strategicmap',
	description: 'Spread a strategic map whenever you need to consult it!',
	server: true,
	options: [
		{
			name: 'map-type',
			description: 'Select the kind of map you want overlayed over the political map!',
			required: true,
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: 'Topographic Map', value: "topographic" },
				{ name: 'Climate Map', value: "climate" },
				{ name: 'Wind Currents Map', value: "wind" },
				{ name: 'Latitude Map', value: "latitude" },
			],
		},
	],

	callback: async (client, interaction) => {
		const { user, member, channel } = interaction;
		const canvas = Canvas.createCanvas(2000, 1250); //image size
		const ctx = canvas.getContext('2d');
		const selectedMap = interaction.options.getString('map-type');
		const avatarURL = user.displayAvatarURL({ dynamic: true, format: 'png', size: 256 });

		//const circle = { x: canvas.width / 2, y: canvas.height /2, radius: 70, }

		// ctx.fileStyle = 'white';

		const bg = await Canvas.loadImage('./resources/map.png'); //load bg

		switch (selectedMap) {
			case `topographic`:
				var map = await Canvas.loadImage('./resources/map-top.png'); //load bg
				break;
			case `climate`:
				var map = await Canvas.loadImage('./resources/map-cli.png'); //load bg
				break;
			case `wind`:
				var map = await Canvas.loadImage('./resources/map-win.png'); //load bg
				break;
			case `latitude`:
				var map = await Canvas.loadImage('./resources/map-lat.png'); //load bg
				break;
		}

		if (selectedMap != `climate`) {
			ctx.drawImage(bg, 0, 0, canvas.width, canvas.height); //draw main map as normal

		} else if (selectedMap == `climate`) {
			ctx.save();
			ctx.filter = 'grayscale(1)';
			ctx.drawImage(bg, 0, 0, canvas.width, canvas.height); //draw main map as normal
			ctx.restore();
		}

		//Image border
		ctx.strokeStyle = '#0099ff';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		//Command target profile picture draw
		const { body } = await request(avatarURL);

		const avatar = await Canvas.loadImage(await body.arrayBuffer());

		ctx.drawImage(avatar, 1, 1, 150, 150);

		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.drawImage(map, 0, 0, canvas.width, canvas.height);
		ctx.restore();

		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'map-strategic.png' });

		await interaction.deferReply({ ephemeral: true });
		channel.send({
			content: `<@${user.id}> has spread a strategic map of the type: **${selectedMap}**`, files: [attachment]
		});
	}
};
