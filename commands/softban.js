const Discord = require('discord.js');
const { Permissions } = require('discord.js');

module.exports = {
    name: "softban",
    description: "Bans a member from the server and immeadiately unbans it",

    async execute(interaction, client) {
        const member = interaction.options.getMentionable("member");
        let reason = interaction.options.getString('reason');

        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        await interaction.guild.bans.fetch().then(async bans => {

            if (!member) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
            if (member.name) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
            if (!member.bannable) return interaction.reply({ content: "You can't ban this user", ephemeral: true });
            if (member.id === client.user.id) return interaction.reply({ content: "I can't ban myself", ephemeral: true });
            if (member.id === interaction.member.id) return interaction.reply({ content: "You can't ban yourself", ephemeral: true });

            let bUser = bans.find(b => b.user.id === member.id);
            if (bUser) return interaction.reply({ content: "That User is Already Banned", ephemeral: true });

            if (!reason) reason = 'Unspecified';

            try {
                await member.ban({
                    reason: reason,
                }).then(
                    await interaction.guild.bans.fetch().then(async bans2 => {
                        let bUser2 = bans2.find(b2 => b2.user.id === member.id);
                        interaction.guild.members.unban(bUser2.user);
                    })
                )
            } catch (error) {
                return interaction.reply({ content: 'Couldn\'t ban that user', ephemeral: true });
            }

            const banembed = new Discord.MessageEmbed()
                .setTitle('Member SoftBanned')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`)
                .addField('User:', member.user.username)
                .addField('Banned By', interaction.member.user.username)
                .addField('Reason:', reason)
                .setFooter({ text: 'Banned At', iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor('#9c4c48');

            interaction.reply({ embeds: [banembed] });
        }).catch(() => interaction.reply({ content: 'Something went wrong', ephemeral: true }));

    }
}