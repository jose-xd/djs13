const { Permissions } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'Mute a member',
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        const member = interaction.options.getMember("member");
        let time = interaction.options.getInteger('time');
        let timeType = interaction.options.getString('time-type');

        if (!member) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (member.name) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (member.bot) return interaction.reply({ content: "I can't warn bots", ephemeral: true });
        if (member.id === client.user.id) return interaction.reply({ content: "I can't mute myself", ephemeral: true });
        if (member.id === interaction.member.id) return interaction.reply({ content: "You can't mute yourself", ephemeral: true });

        if (time && time.length > 5) return interaction.reply({ content: "Put a shorter time", ephemeral: true });
        if (time && time.length < 2) return interaction.reply({ content: "Put a greater time", ephemeral: true });

        const role = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!role) {
            let muteRole = await interaction.guild.roles.create({
                name: 'Muted',
                permissions: [Permissions.FLAGS.VIEW_CHANNEL]
            }).catch(err => {
                return interaction.reply({ content: 'Something went wrong', ephemeral: true });
            })

            await interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel, id) => {
                await channel.permissionOverwrites.create(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
            
            if (member.roles.cache.has(muteRole.id)) return interaction.reply({ content: "That user has been already muted", ephemeral: true });
            await member.roles.add(muteRole.id);
            interaction.reply(`${member} is now muted`);

            if (!time && !timeType) return;

            setTimeout(async function () {
                if (!member.roles.cache.has(muteRole.id)) return;
                await member.roles.remove(muteRole);
            }, ms(`${time}${timeType}`));

        } else {
            if (member.roles.cache.has(role.id)) return interaction.reply({ content: "That user has been already muted", ephemeral: true });
            await member.roles.add(role);
            interaction.reply(`${member} is now muted`);

            if (!time && !timeType) return;

            setTimeout(async function () {
                if (!member.roles.cache.has(role.id)) return;
                await member.roles.remove(role);
            }, ms(`${time}${timeType}`));
        }
    }
}