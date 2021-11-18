const { Permissions } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Clear messages',
    async execute(interaction) {
        const args = interaction.options.getInteger("quantity");

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }
        if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        if (args > 100) return interaction.reply({ content: 'You need put a number less than 100', ephemeral: true });
        if (args < 1) return interaction.reply({ content: 'You need to put a number greater than 1', ephemeral: true });

        try {
            await interaction.channel.messages.fetch({ limit: args }).then(messages => {
                interaction.channel.bulkDelete(messages);
            });
        } catch (error) {
            interaction.reply({ content: 'Something went wrong', ephemeral: true });
        }

        interaction.reply({ content: 'Cleared the messages successfully', ephemeral: true });
    }
}