const Discord = require('discord.js');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a member',
    async execute(interaction, client) {
        const member = interaction.options.getMentionable("member");
        let reason = interaction.options.getString('reason');

        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        if (!reason) reason = 'Unspecified';

        if (!member) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (member.name) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (!member.bannable) return interaction.reply({ content: "You can't kick this user", ephemeral: true });
        if (member.id === client.user.id) return interaction.reply({ content: "I can't kick myself", ephemeral: true });
        if (member.id === interaction.member.id) return interaction.reply({ content: "You can't kick yourself", ephemeral: true });

        if (!reason) reason = 'Unspecified';

        try {
            member.kick({
                reason: reason,
            });
        } catch (error) {
            return interaction.reply({ content: 'Couldn\'t ban that user', ephemeral: true });
        }

        const kickembed = new Discord.MessageEmbed()
            .setTitle('Member Kicked')
            .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`)
            .addField('User:', member.user.username)
            .addField('Banned By', interaction.member.user.username)
            .addField('Reason:', reason)
            .setFooter('Banned At', client.user.displayAvatarURL())
            .setTimestamp()
            .setColor('#9c4c48');

        interaction.reply({ embeds: [kickembed] });

    }
}