const Discord = require('discord.js');
const { Permissions } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "tempban",
    description: "Bans a member temporarily from the server",

    async execute(interaction, client) {
        const member = interaction.options.getMentionable("member");
        let reason = interaction.options.getString('reason');
        let time = interaction.options.getNumber('time');

        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        if (time.length > 5) return interaction.reply({ content: "Put a shorter time", ephemeral: true });
        if (time.length < 2) return interaction.reply({ content: "Put a greater time", ephemeral: true });

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
                member.ban({
                    reason: reason,
                });
            } catch (error) {
                return interaction.reply({ content: 'Couldn\'t ban that user', ephemeral: true });
            }

            const banembed = new Discord.MessageEmbed()
                .setTitle('Member Banned')
                .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`)
                .addField('User:', member.user.username)
                .addField('Banned By', interaction.member.user.username)
                .addField('Reason:', reason)
                .setFooter({ text: 'Banned At', iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
                .setColor('#9c4c48');

            interaction.reply({ embeds: [banembed] });
        }).catch(() => interaction.reply({ content: 'Something went wrong', ephemeral: true }));

        setTimeout(async function () {
            await interaction.guild.bans.fetch().then(async bans2 => {
                if (bans2.size == 0) return;
                let bannedUser = bans2.find(b2 => b2.user.id == member.id);
                if (!bannedUser) return;
                await interaction.guild.members.unban(bannedUser.user, reason).catch(err => console.log(err));
            });
        }, ms(`${time}`));
    }
}