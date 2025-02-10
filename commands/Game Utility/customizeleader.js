const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, ActionRowBuilder } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');
const { ComponentType } = require('../../node_modules/discord-api-types/v10');

module.exports = {
    name: 'customizeleader',
    description: 'Customize your nation´s leader character!',
    server: true,
    options: [
        {
            name: 'leader-name',
            description: 'Your current leader´s name!',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'description',
            description: 'Your leader´s background and personality!',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'age',
            description: 'Your current leader´s age!',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
        {
            name: 'titles',
            description: 'Your leader´s titles and nicknames!',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'gender',
            description: 'Your leader´s gender!',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'portrait',
            description: 'Your leader´s physical appearance!',
            required: false,
            type: ApplicationCommandOptionType.Attachment,
        },

    ],
    callback: async (client, interaction) => {
        const { user, member, channel } = interaction;

        const country = await getColorCode(member);

        const leaderName = interaction.options.getString('leader-name');
        const leaderDescription = interaction.options.getString('description');
        const leaderAge = interaction.options.getInteger('age');
        var leaderPortrait = interaction.options.getAttachment('portrait').url;
        var leaderTitles = interaction.options.getString('titles');
        var leaderGender = interaction.options.getString('gender');

        if (leaderPortrait == null) { leaderPortrait = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Gamla_Stan%2C_S%C3%B6dermalm%2C_Stockholm%2C_Sweden_-_panoramio_%28217%29.jpg/1200px-Gamla_Stan%2C_S%C3%B6dermalm%2C_Stockholm%2C_Sweden_-_panoramio_%28217%29.jpg' }
        if (leaderTitles == null) { leaderTitles = 'No Titles.' }
        if (leaderGender == null) { leaderGender = 'Unspecified' }

        const traits = `${await getData(country.id, 'traits', 'No Traits')}`

        await interaction.deferReply({ ephemeral: false });

        const confirmChanges = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Changes')
            .setStyle(ButtonStyle.Success)
            .setEmoji('<:check:1283459658400530556>');
        const cancelChanges = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel Changes')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('<:cross:1283459669020381268>');
        
        const customizationPreviewEmbed = new EmbedBuilder()
            .setColor(`${country.hexColor}`)
            .setTitle('<:gift:1283459546253103174> NATION LEADER SCREEN')
            .setAuthor({ name: `${country.name}`, iconURL: `${user.avatarURL()}` })
            .setDescription(`
            > <:exclamation:1283459533569527879> This is only a preview, to confirm changes, please press the '**Confirm Changes**' button.
            Player: <@${user.id}>
            ‎`)
            .addFields({
                name: '◇──◇Personal Information◇──◇', value: `
                **Name:** ${leaderName}

                **Background:** ${leaderDescription}

                **Age:** ${leaderAge}
                ‎ 
                `, })
            .addFields({
                name: '◇──◇Additional Information◇──◇', value: `
                **Gender:** ${leaderGender}
                
                **Titles:** ${leaderTitles}
                ‎ 
                `, })
            .addFields({
                name: '◇──◇Traits◇──◇', value: `
                ${traits}
                ‎ 
                `, })
            .setImage(`${leaderPortrait}`);
            
        if (country.icon != null) {
            customizationPreviewEmbed.setThumbnail(`${country.iconURL()}`);
        } else {
            customizationPreviewEmbed.setThumbnail(`${user.displayAvatarURL()}`);
        }
    
        const row = new ActionRowBuilder()
            .addComponents(confirmChanges, cancelChanges);
        
        const response = await interaction.followUp({
            content: 'Do you want to save these changes?',
            embeds: [customizationPreviewEmbed],
            components: [row],
            withResponse: true,
        });
        const collectorFilter = i => i.user.id === interaction.user.id;
		const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, filter: collectorFilter, time: 60_000 });

        collector.on('collect', async (interaction) => {
	     if (interaction.customId === 'confirm') {
                await setData(country.id, 'leader_name', leaderName);
                await setData(country.id, 'description', leaderDescription);
                await setData(country.id, 'age', leaderAge);
                await setData(country.id, 'portrait', leaderPortrait);
                await setData(country.id, 'titles', leaderTitles);
                await setData(country.id, 'gender', leaderGender);
                await interaction.update({ content: `Changes saved successfully! Do /leaderprofile to check!`, embeds: [], components: [], });
            } else if (interaction.customId === 'cancel') {
                await interaction.update({ content: `Customization process cancelled!`, embeds: [], components: [], });
            }
        }); 
        
        collector.on('end', () => {
            confirmChanges.setDisabled(true);
            cancelChanges.setDisabled(true);
        });
    }
};