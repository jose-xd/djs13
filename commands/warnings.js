const WarnSchema = require('../schemas/Warn');
const { Permissions } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'warnings',
    description: 'See the warnings of a member',
    async execute(interaction, client) {
        const member = interaction.options.getUser("member");

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

        const userId = member.id

        const results = await WarnSchema.findOne({
            id: interaction.guild.id,
            user: userId
        }).catch(err => { interaction.reply({ content: "Something went wrong", ephemeral: true }) })

        if (!results) return interaction.reply({ content: "That user doesn't have warnings", ephemeral: true })

        let reply = `Previous warnings for <@${userId}>:\n\n`

        for (const warnings of results.warnings) {
            const { author, timestamp, reason } = warnings

            reply += `Warned by ${author} on ${new Date(
                timestamp
            ).toLocaleDateString()} Reason: "${reason}"\n\n`
        }

        fs.writeFile('warnings.txt', reply, function (err) {
            if (err) throw err;
        });
        interaction.reply({ content: reply, files: ["./warnings.txt"] }).catch(err => { interaction.reply({ content: "Something went wrong", ephemeral: true }) })
    }
}