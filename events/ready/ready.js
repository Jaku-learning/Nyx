const { ActivityType, PresenceUpdateStatus } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode.js');

module.exports = async (client, interaction) => {
    const { user, member, message, channel } = interaction;

    var currentYear = await getData('server', 'year', 9999);

    console.log(`Ready, logged in as ${client.user.tag}`);
    const time = Date.now();
    const date = new Date(time);
    // formatted: vDD.MM.YYYY 
    const formattedVersion = `${date.getDate().toString().padStart(2, '0')}.` +`${(date.getMonth() + 1).toString().padStart(2, '0')}.` + `${date.getFullYear()}`;

    client.user.setActivity({
        name: 'Being built with love!, Version: v'+formattedVersion,
        type: ActivityType.Watching,
        status: PresenceUpdateStatus.DoNotDisturb
    });

    setInterval(async () => {
        const guild = client.guilds.cache.get('1186040107732570153');
        if (!guild) return console.error("No se encontró el servidor.");
    
        const members = await guild.members.fetch();
        var countries = [];
    
        for (const member of members.values()) {
            let highestColorRole = await getColorCode(member);
            if (highestColorRole) {
                countries.push(highestColorRole.id);
            }
        }
    
        //console.log(countries);
    
        var updatedYear = await getData('server', 'year', 9999);
    
        if (currentYear < updatedYear) {
            client.channels.cache.get('1334637749663305749').send(`Year updated from **${currentYear}** to **${updatedYear}**!`);
            currentYear = updatedYear;
        }
    }, 120_000);
    
}