const WarnSchema = require('../schemas/Warn')
const { Permissions } = require('discord.js');

module.exports = {
    name: 'rwarns',
    description: 'Remove the warnings of a member',
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
        if (member.id === interaction.member.id) return interaction.reply({ content: "You can't mute yourself", ephemeral: true });

        const user = member.id;

        const result = await WarnSchema.findOneAndDelete({
            id: interaction.guild.id,
            user: user
        }).catch(err => { interaction.reply({ content: "Something went wrong", ephemeral: true }) });

        if (!result) return interaction.reply({ content: "That user doesn't have warnings", ephemeral: true });

        return interaction.reply(`The ${member}'s warnings have been removed`);
    }
}