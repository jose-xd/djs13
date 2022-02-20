const { Permissions } = require('discord.js');

module.exports = {
    name: 'timeout',
    description: 'Timeout a member',
    async execute(interaction, client) {
        const member = interaction.options.getMentionable("member");
        const time = interaction.options.getNumber("time");
        let reason = interaction.options.getString('reason');

        if (!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return interaction.reply({ content: "I don't have enough permissions to run this command", ephemeral: true });
        }

        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: "You can't timeout this user", ephemeral: true });
        }
        if (!member) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (member.name) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (!member.kickable) return interaction.reply({ content: "You can't timeout this user", ephemeral: true });
        if (member.id === client.user.id) return interaction.reply({ content: "I can't timeout myself", ephemeral: true });
        if (member.id === interaction.member.id) return interaction.reply({ content: "You can't timeout yourself", ephemeral: true });

        if (!reason) reason = 'Unspecified';

        member.timeout(time, reason)

        const times = {
            60000:  '60 Seconds',
            300000:  '5 Minutes',
            600000: '10 Minutes',
            3600000:    '1 Hour',
            86400000:    '1 Day',
            604800000:   '1 Week'
        }

        interaction.reply({ content: `${member} has been timed out for ${times[time]}. Reason: ${reason}` });
    }
}