const Discord = require('discord.js');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unbans a member',
    async execute(interaction, client) {
        const member = interaction.options.getString("id");
        let reason = interaction.options.getString('reason');

        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        if (!member) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (isNaN(member)) return interaction.reply({ content: "That is not an ID", ephemeral: true });
        if (member === client.user.id) return interaction.reply({ content: "I can't ban myself", ephemeral: true });
        if (member === interaction.member.id) return interaction.reply({ content: "You can't ban yourself", ephemeral: true });
        if (member.length > 18) return interaction.reply({ content: "Provide a valid ID", ephemeral: true });
        if (member.length < 18) return interaction.reply({ content: "Provide a valid ID", ephemeral: true });

        if (!reason) reason = 'Unspecified';

        await client.users.fetch(member).then(async user => {
            await interaction.guild.members.unban(user.id, { reason: reason });

            const unbanembed = new Discord.MessageEmbed()
                .setTitle('Member Unbanned')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
                .addField('User:', user.username)
                .addField('Unbanned By', interaction.member.user.username)
                .addField('Reason:', reason)
                .setFooter({ text: 'Banned At', iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor('#9c4c48');

            interaction.reply({ embeds: [unbanembed] });
        }).catch(() => {
            return interaction.reply({ content: 'Couldn\'t ban that user', ephemeral: true });
        })
    },
};