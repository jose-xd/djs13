const { Permissions } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Locks the channel',
    async execute(interaction) {

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        interaction.channel.permissionOverwrites.create(interaction.channel.guild.roles.everyone, { SEND_MESSAGES: false });

        interaction.reply("The channel has been locked");
    }
}