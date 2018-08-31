exports.id = 'claim';

const fsn = require("fs-nextra");

exports.onLoad = api => {
    api.commands.add('claim', (msg) => {
        // The ticket ID.
        let ticketID = msg.content.substring(8);

        fsn.readJSON("./orders.json").then((orderDB) => {
            const order = orderDB[ticketID];

            // If the order doesn't exist.
            if(order === undefined) {
                msg.reply("Couldn't Find that Order. Try Again!");

                return;
            }
            
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
                    "chef": msg.author.id
                };

                // Gets matching messages in tickets channel.
                api.client.channels.get("483743363909025806").fetchMessages({
                    limit: 100 
                }).then(msgs => {
                    let msg = msgs.filter(m => m.content.includes(ticketID));

                    // Edits the message in the tickets channel.
                    msg.first().edit({embed: {
                        color: "3447003",
                        title: msg.author.username,
                        fields: [{
                            name: ":ticket: New Ticket",
                            value: `${msg.author.username} would like a popsicle.`,
                        }, {
                            name: ":newspaper2: Popsicle Description",
                            value: order,
                        }, {
                            name: ":hash: Ticket ID",
                            value: ticketID,
                        }, {
                            name: ":computer: Guild Infomation",
                            value: `This ticket came from ${msg.guild} (${msg.guild.id}) in ${msg.channel} (${msg.channel.id}).`,
                        }, {
                            name: ":white_check_mark: Ticket Status",
                            value: "Claimed", 
                        }],
                        timestamp: new Date(),
                        footer: {
                            text: "Discord Popsicles"
                        }
                    }});
                });

                // Writes Data to JSON.
                fsn.writeJSON("./orders.json", orderDB, {
                    replacer: null,
                    spaces: 4
                }).then(() => {
                    // Send's a message to the cook.
                    msg.channel.send(":thumbsup: You've now claimed `" + ticketID + "`!");

                    // Sends a message to the customer.
                    api.client.users.get(order.userID).send(`Guess what? Your ticket has now been claimed by **${msg.author.username}**! It should be started shortly.`)
                }).catch((err) => {
                    if (err) {
                        message.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``)
                    }
                });
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
};
