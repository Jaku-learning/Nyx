const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

function rollDiceInt(min, max) {
	return Math.floor(Math.random() * Math.floor(max) + min);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spysweep')
		.setDescription('Conduct a spysweep! Only ONCE a year!')
		.addIntegerOption(option =>
			option
				.setName('agency_level')
				.setDescription(`Your nation's intelligence agency level.`)
				.setRequired(true)
				.setMinValue(1))
		.addIntegerOption(option =>
			option
				.setName('year')
				.setDescription(`Current IRP year, must be correct or else the result will be void!`)
				.setRequired(true)
				.setMinValue(1)),

	async execute(interaction) {
		const { user, member, channel } = interaction;
		const agencyLevel = interaction.options.getInteger('agency_level');
		const currentYear = interaction.options.getInteger('year');

		//ai agency level roll
		const AILevel = rollDiceInt(5, 15)

		//dice rolls for ai and player
		const resultPlayer = rollDiceInt(1, 100);
		const resultAI = rollDiceInt(1, 100);

		//Calculate results
		const playerLevelBuff = agencyLevel * 3;
		const AILevelBuff = AILevel * 3;

		const playerTotal = resultPlayer + playerLevelBuff;
		const AITotal = resultAI + AILevelBuff;

		const finalResult = playerTotal - AITotal;
		var resultMessage = "";

		if (finalResult <= -50) {
			resultMessage = "CATASTROPHIC FAILURE";
		} else if (finalResult >= -49 && finalResult <= -30) {
			resultMessage = "SLIGHT FAILURE";
		} else if (finalResult >= -29 && finalResult <= -1) {
			resultMessage = "FAILURE";
		} else if (finalResult >= 1 && finalResult <= 29) {
			resultMessage = "SLIGHT SUCCESS";
		} else if (finalResult >= 30 && finalResult <= 49) {
			resultMessage = "SUCCESS";
		} else if (finalResult >= 50) {
			resultMessage = "OVERWHELMING SUCCESS";
		} else if (finalResult == 0) {
			resultMessage = "NEUTRAL";
		}

		const spysweepEmbed = new EmbedBuilder()
			.setColor(0x904f8d)
			.setTitle('<:world:1283459444705071207> SPYSWEEP MENU')
			.setAuthor({name: `${user.tag}`, iconURL: `${user.avatarURL()}`})
			.setDescription(`
			> <:business:1277981102681620591> Player Intelligence Agency Level: ${agencyLevel}
			> <:business:1277981102681620591> AI Intelligence Agency Level: ${AILevel}
			> <:check:1283459658400530556> In-Game Year for Roll: ${currentYear}

			Modifiers: | Player Level Buff: ${playerLevelBuff} | AI Level Buff: ${AILevelBuff}
			Player: <@${user.id}>`)
			.setThumbnail('https://pbs.twimg.com/media/FNp7AC7XEAE41zT.png:large');
		await interaction.deferReply({ ephemeral: true });
		channel.send({
			content:`
			# Final Result: ${finalResult} | ${resultMessage}
			## NAT Result (player): ${resultPlayer} | NAT Result (AI): ${resultAI}`,
			embeds: [spysweepEmbed]
		});
	},
};
	