const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config();
require('./database')
const fs = require('fs');

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...interaction) => event.execute(...interaction, client));
    }
}

client.on('messageCreate', async message => {
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
        const data = [
            {
                name: 'avatar',
                description: 'Show a member\'s avatar',
                options: [{
                    name: 'member',
                    type: 'USER',
                    description: 'The member you want to see their avatar',
                    required: true,
                }]
            },
            {
                name: 'ban',
                description: 'Ban a member',
                options: [{
                    name: 'member',
                    type: 'MENTIONABLE',
                    description: 'The member you want to ban',
                    required: true,
                }, {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the ban'
                }],
            },
            {
                name: 'unban',
                description: 'Unban a member',
                options: [{
                    name: 'id',
                    type: 'STRING',
                    description: 'The member you want to unban',
                    required: true,
                }, {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the ban'
                }],
            },
            {
                name: 'clear',
                description: 'Clear messages',
                options: [{
                    name: 'quantity',
                    type: 'INTEGER',
                    description: 'Quantity of messages (0-100)',
                    required: true,
                }]
            },
            {
                name: 'hackban',
                description: 'Bans a member that isn\'t in the server',
                options: [{
                    name: 'member-id',
                    type: 'STRING',
                    description: 'The member id you want to ban',
                    required: true,
                }, {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the ban'
                }],
            },
            {
                name: 'invite',
                description: 'Invite Link of the bot'
            },
            {
                name: 'kick',
                description: 'Kick a member',
                options: [{
                    name: 'member',
                    type: 'MENTIONABLE',
                    description: 'The member you want to kick',
                    required: true,
                }, {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the kick'
                }],
            },
            {
                name: 'lock',
                description: 'Locks the channel'
            },
            {
                name: 'unlock',
                description: 'Unlocks the channel'
            },
            // {
            //     name: 'mute',
            //     description: 'Mute a member',
            //     options: [
            //         {
            //             name: 'member',
            //             type: 'USER',
            //             description: 'The member you want to mute',
            //             required: true,
            //         }, {
            //             name: 'time',
            //             type: 'INTEGER',
            //             description: 'The time of the mute'
            //         }, {
            //             name: 'time-type',
            //             type: 'STRING',
            //             description: 'The time type',
            //             choices: [
            //                 {
            //                     name: 'Seconds',
            //                     value: 's',
            //                 },
            //                 {
            //                     name: 'Minutes',
            //                     value: 'm',
            //                 },
            //                 {
            //                     name: 'Hours',
            //                     value: 'h',
            //                 },
            //             ],
            //         }
            //     ],
            // },
            {
                name: 'warn',
                description: 'Warn a member',
                options: [{
                    name: 'member',
                    type: 'USER',
                    description: 'The member you want to warn',
                    required: true,
                }, {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the warn'
                }],
            },
            {
                name: 'rwarns',
                description: 'Remove te warnings of a member',
                options: [{
                    name: 'member',
                    type: 'USER',
                    description: 'The member you want to remove their warnings',
                    required: true
                }]
            },
            {
                name: 'warnings',
                description: 'See the warnings of a member',
                options: [{
                    name: 'member',
                    type: 'USER',
                    description: 'The member you want to see their warnings',
                    required: true
                }]
            },
            {
                name: 'softban',
                description: 'Bans a member from the server and immeadiately unbans it',
                options: [{
                    name: 'member',
                    type: 'MENTIONABLE',
                    description: 'The member you want to softban',
                    required: true,
                }, {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the softban'
                }],
            },
            {
                name: 'echo',
                description: 'The bot will reply with your message',
                options: [{
                    name: 'message',
                    type: 'STRING',
                    description: 'The message',
                    required: true,
                }]
            },
            {
                name: 'timeout',
                description: 'Give a timeout',
                options: [{
                    name: 'member',
                    type: 'MENTIONABLE',
                    description: 'The member you want to give a timeout',
                    required: true,
                }, {
                    name: 'time',
                    type: 'NUMBER',
                    description: 'The time',
                    required: true,
                    choices: [
                        {
                            name: '60 Seconds',
                            value: 60000,
                        },
                        {
                            name: '5 Minutes',
                            value: 300000,
                        },
                        {
                            name: '10 Minutes',
                            value: 600000,
                        },
                        {
                            name: '1 Hour',
                            value: 3600000,
                        },
                        {
                            name: '1 Day',
                            value: 86400000,
                        },
                        {
                            name: '1 Week',
                            value: 604800000,
                        },
                    ],
                }, {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the ban'
                },],
            },
            {
                name: 'tempban',
                description: 'Give a timeout',
                options: [{
                    name: 'member',
                    type: 'MENTIONABLE',
                    description: 'The member you want to give a timeout',
                    required: true,
                }, {
                    name: 'time',
                    type: 'NUMBER',
                    description: 'The time',
                    required: true,
                    choices: [
                        {
                            name: '60 Seconds',
                            value: 60000,
                        },
                        {
                            name: '5 Minutes',
                            value: 300000,
                        },
                        {
                            name: '10 Minutes',
                            value: 600000,
                        },
                        {
                            name: '1 Hour',
                            value: 3600000,
                        },
                        {
                            name: '1 Day',
                            value: 86400000,
                        },
                        {
                            name: '1 Week',
                            value: 604800000,
                        },
                    ],
                }, {
                    name: 'reason',
                    type: 'STRING',
                    description: 'The reason for the ban'
                },],
            }
        ]

        const command = await client.guilds.cache.get(process.env.GUILD_ID)?.commands.set(data);
        console.log(command);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);

//https://discord.com/oauth2/authorize?client_id=873286942211579934&permissions=2100686078&scope=bot%20applications.commands