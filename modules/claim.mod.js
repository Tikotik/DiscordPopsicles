exports.id = 'claim';

const fsn = require("fs-nextra");
const colors = require("colors");

exports.onLoad = api => {
    api.commands.add('claim', (msg) => {
        let employeeRole = msg.guild.roles.get("483739310269399051");

        if(msg.member.roles.has(employeeRole.id)) {
            if(msg.channel.id == 483744245237284875) {
                // The ticket ID.
                let ticketID = msg.content.substring(8);

                fsn.readJSON("./orders.json").then((orderDB) => {
                    const order = orderDB[ticketID];
                    
                    // If the order doesn't exist.
                    if(order === undefined) {
                        msg.reply("Couldn't Find that Order. Try Again!");

                        return;
                    }
                    
                    // Edits the message in the tickets channel.
                    api.client.channels.get("483743363909025806").fetchMessages({
                        around: order.ticketChannelMessageID,
                        limit: 1
                    }).then(messages => {
                        const fetchedMsg = messages.first();

                        fetchedMsg.edit({embed: {
                            color: "3447003",
                            title: api.client.users.get(order.userID).username,
                            fields: [{
                                name: ":ticket: New Ticket",
                                value: `${api.client.users.get(order.userID).username} would like a popsicle.`,
                            }, {
                                name: ":newspaper2: Popsicle Description",
                                value: order.order,
                            }, {
                                name: ":hash: Ticket ID",
                                value: ticketID,
                            }, {
                                name: ":computer: Guild Infomation",
                                value: `This ticket came from ${api.client.guilds.get(order.guildID).name} (${order.guildID}) in #${api.client.channels.get(order.channelID).name} (${api.client.channels.get(order.channelID).id}).`,
                            }, {
                                name: ":white_check_mark: Ticket Status",
                                value: "Claimed", 
                            }],
                            timestamp: new Date(),
                            footer: {
                                text: "Discord Popsicles"
                            }
                        }}).then((m) => {
                            m = m.id;
    
                            // Update Status
                            if (order.status === "Unclaimed") {
                                delete orderDB[ticketID];
    
                                orderDB[ticketID] = {
                                    "orderID": order.orderID,
                                    "userID": order.userID,
                                    "guildID": order.guildID,
                                    "channelID": order.channelID,
                                    "order": order.order,
                                    "status": "Claimed",
                                    "ticketChannelMessageID": m,
                                    "chef": msg.author.id
                                };
    
                                // Writes Data to JSON.
                                fsn.writeJSON("./orders.json", orderDB, {
                                    replacer: null,
                                    spaces: 4
                                }).then(() => {
                                    // Send's a message to the cook.
                                    msg.channel.send(`:thumbsup: You've now claimed \`${ticketID}\`.`);
    
                                    // Sends a message to the customer.
                                    api.client.users.get(order.userID).send(`Guess what? Your ticket has now been claimed by **${msg.author.username}**! It should be started shortly.`)
                                }).catch((err) => {
                                    if (err) {
                                        msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``)
                                    }
                                });
    
                                console.log(colors.green(`${msg.author.username} claimed ticket ${ticketID}.`))
                            }else if(order.status === "Claimed") {
                                if(order.chef !== msg.author.id) {
                                    msg.reply(`This ticket is already claimed by ${api.client.users.get(order.chef).tag}`);
                                }else {
                                    msg.reply(`You have already claimed this ticket. Run \`p!freeze [Ticket ID]\` to start making this ticket.`);
                                }
                            }else if(order.status === "Cooking") {
                                msg.reply("This order is already claimed and freezing right now. Wait a little bit, then run `p!deliver [Ticket ID]` in <#483744285145956382> to deliver.");
                            }else if(order.status === "Cooked") {
                                msg.reply("This order is already frozen and ready to be delivered. Run `p!deliver [Ticket ID]` in <#483744285145956382> to deliver.");
                            }
                        });
                    });
                });
            }else {
                msg.reply("Please use this command in the <#483744245237284875> channel.");
                console.log(colors.red(`${msg.author.username} used the claim command in the wrong channel.`));
            }
        }else {
            msg.reply("You do not have access to this command.");
            console.log(colors.red(`${msg.author.username} did not have access to the claim command.`));
        }
    });
};
