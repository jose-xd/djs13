const { Permissions } = require('discord.js');

module.exports = {
    name: 'detimeout',
    description: 'Detimeout a member',
    async execute(interaction, client) {
        const member = interaction.options.getMentionable("member");

        if (!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return interaction.reply({ content: "I don't have enough permissions to run this command", ephemeral: true });
        }

        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: "You can't detimeout this user", ephemeral: true });
        }
        if (!member) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (member.name) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (!member.kickable) return interaction.reply({ content: "You can't timeout this user", ephemeral: true });
        if (member.id === client.user.id) return interaction.reply({ content: "I can't timeout myself", ephemeral: true });
        if (member.id === interaction.member.id) return interaction.reply({ content: "You can't timeout yourself", ephemeral: true });

        member.timeout(0, '')

        interaction.reply({ content: `The timeout of ${member} has been eliminated` });
    }
}