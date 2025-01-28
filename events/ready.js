const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity({
            name: 'Being built with love!',
            type: ActivityType.Watching,
            status: PresenceUpdateStatus.DoNotDisturb
        });
            
        console.log(`Ready, logged in as ${client.user.tag}`);
    },
};