const { ActivityType, PresenceUpdateStatus } = require('discord.js');
const { addData, setData, getData } = require('../../utils/database/DatabaseManager.js');
const getColorCode = require('../../utils/getColorCode');

module.exports = async (client, interaction) => {
    const { user, member, message, channel } = interaction;

    var currentYear = await getData('server', 'year', 9999);

    console.log(`Ready, logged in as ${client.user.tag}`);
    client.user.setActivity({
        name: 'Being built with love!',
        type: ActivityType.Watching,
        status: PresenceUpdateStatus.DoNotDisturb
    });

    setInterval(async () => {
        var membersRaw = client.guilds.cache.get('1186040107732570153').members.cache.map(async (member) => member)
        var countries = []
        /*var val = countriesRaw.trim();
        var countriesArray = val ? countriesRaw.split(",") : [];*/

        //console.log(countriesRaw)

        /*countriesRaw.forEach(async (member) => {
            console.log(member.nickname)
            let country = await getColorCode(member);
            //let mbr = memberR.cache.id;
            //console.log(country);
            //countries.push(country.id);
        });*/

        console.log(countries);

        for (i = 0; i < membersRaw.length; i++) {
            let mbr = membersRaw[i].id;
            console.log(mbr);
            //countries.push(mbr);
        }
        
        var updatedYear = await getData('server', 'year', 9999);

        if (currentYear < updatedYear) {
            client.channels.cache.get('1334637749663305749').send(`Year updated from **${currentYear}** to **${updatedYear}**!`);

            currentYear = updatedYear;
        }

        //console.log(countries);
    }, 120_000);
}