const Discord = require('discord.js')

module.exports = {
    name: 'invite',
    description: 'Invite link',
    async execute(interaction) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Invite Link')
            .setURL("https://discord.com/oauth2/authorize?client_id=873286942211579934&permissions=2100686078&scope=bot%20applications.commands")
            .setColor('#9c4c48');

        interaction.reply({ embeds: [embed] });
    }
}