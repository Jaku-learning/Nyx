const { ActivityType, PresenceUpdateStatus } = require('discord.js');

module.exports = (client) => {
    console.log(`Ready, logged in as ${client.user.tag}`);
    client.user.setActivity({
        name: 'Being built with love!',
        type: ActivityType.Watching,
        status: PresenceUpdateStatus.DoNotDisturb
    });
}