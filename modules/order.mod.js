const fsn = require("fs-nextra");
const colors = require("colors");

exports.id = "order";

exports.onLoad = api => {
    api.commands.add("order", (msg) => {
        // The order.
        let order = msg.content.substring(8);

        fsn.readJSON("./blacklist.json").then((blacklistDB) => {
            let entry = blacklistDB[msg.guild.id];
            
            // Checks is server is blacklisted or not.
            if(entry === undefined) {
                // Gets ticket ID.
                function generateID() {
                    let ticketGen = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
                    let ticketStr = "";
        
                    for(let i = 0; i < 7; i++) {
                        ticketStr += ticketGen[Math.floor(Math.random() * ticketGen.length)];
                    }
        
                    return ticketStr;
                }
                const ticketID = generateID();
        
                // Sends ticket information to tickets channel.
                api.client.guilds.get("483736796354576394").channels.get("483743363909025806").send({embed: {
                    color: 0xFFFFFF,
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
                        value: "Unclaimed", 
                    }],
                    timestamp: new Date(),
                    footer: {
                        text: "Discord Popsicles"
                    }
                }}).then((m) => {
                    m = m.id;
        
                    // Sets ticket info.
                    fsn.readJSON("./orders.json").then(orderDB => {
                        // Set JSON information.
                        if (!orderDB[ticketID]) orderDB[ticketID] = {
                            "orderID": ticketID,
                            "userID": msg.author.id,
                            "guildID": msg.guild.id,
                            "channelID": msg.channel.id,
                            "order": order,
                            "status": "Unclaimed",
                            "ticketChannelMessageID": m
                        }
            
                        // Write JSON information.
                        fsn.writeJSON("./orders.json", orderDB, {
                            replacer: null,
                            spaces: 4
                        }).then(() => {
                            // Sends an embed to the customer.
                            msg.channel.send({embed: {
                                color: 0xFFFFFF,
                                title: "Ticket Created",
                                description: "Your order has been placed!",
                                fields: [{
                                    name: "Your Ticket ID",
                                    value: `\`${ticketID}\``
                                    }],
                                timestamp: new Date(),
                            }});
            
                            // Logs in console.
                            console.log(colors.green(`${msg.author.username} ordered "${order}" in ${msg.guild.name} (${msg.guild.id}) in ${msg.channel.name} (${msg.channel.id}).`));
                        }).catch((err) => {
                            if(err) {
                                msg.reply(`There was a database error! Show the following message to a developer: \`\`\`${err}\`\`\``)
                                console.log(colors.red(`Error in order ${ticketID}: ${err}`));
                            }
                        });
                    });
                });
            }else {
                msg.reply("This server is currently blacklisted. If you wish to continue using this bot, please join our support server and discuss it there. You can get the invite link by doing `p!invite`.");
            }
        });
    });
};
