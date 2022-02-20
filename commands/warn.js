const WarnSchema = require('../schemas/Warn')
const { Permissions } = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Warns a member',
    async execute(interaction, client) {
        const member = interaction.options.getUser("member");
        let reason = interaction.options.getString('reason');

        if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        if (!member) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (member.name) return interaction.reply({ content: "I couldn't find that user", ephemeral: true });
        if (member.bot) return interaction.reply({ content: "I can't warn bots", ephemeral: true });
        if (member.id === client.user.id) return interaction.reply({ content: "I can't mute myself", ephemeral: true });
        if (member.id === interaction.member.id) return interaction.reply({ content: "You can't mute yourself", ephemeral: true });

        if (!reason) reason = 'Unspecified';

        if (reason.length > 25) return interaction.reply({ content: "Please provide a shorter reason", ephemeral: true });

        const warning = {
            author: interaction.member.user.username,
            timestamp: new Date().getTime(),
            reason,
        }

        const user = member.id;

        const memberWarned = await WarnSchema.findOne({
            id: interaction.guild.id,
            user: user
        });
        
        if (memberWarned && memberWarned.warnings.length > 25) {
            return interaction.reply({ content: "That user has already 25 warnings, that's the maximum an user ", ephemeral: true });
        }

        await memberWarned.updateOne(
            {
                id: interaction.guild.id,
                user: user,
                $push: {
                    warnings: warning,
                },
            },
            {
                upsert: true
            }).catch(err => { interaction.reply({ content: 'Something went wrong', ephemeral: true }), console.log(err) });

        return interaction.reply(`${member} has been warned. Reason: ${reason}`);
    }
}