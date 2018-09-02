exports.id = "deliver";

const fsn = require("fs-nextra");
const colors = require("colors");

exports.onLoad = api => {
    api.commands.add("deliver", (msg) => {
        let employeeRole = msg.guild.roles.get("483739310269399051");

        if(msg.member.roles.has(employeeRole.id)) {
            if(msg.channel.id == 483744285145956382) {
                fsn.readJSON("./orders.json").then((orderDB) => {
                    let ticketID = msg.content.substring(10);
                    let order = orderDB[ticketID];
        
                    // Send message to cook.
                    msg.reply("I've DM'd you information about this order! :thumbsup:");
        
                    // Direct message cook.
                    msg.author.send({embed: {
                        fields: [{
                            name: "Delivery Info",
                            value: "The ticket has been deleted, it's all on you now."
                        }, {
                            name: "Ticket Description",
                            value: order.order
                        }, {
                            name: "User Information",
                            value: `${api.client.users.get(order.userID).username} (${api.client.users.get(order.userID).id}) in ${api.client.channels.get(order.channelID).name} (${api.client.channels.get(order.channelID).id}).`
                        }, {
                            name: "Cook's Image",
                            value: order.imageURL
                        }],
                        timestamp: new Date()
                    }});
                    
                    // TODO: Invite
                    api.client.channels.get(order.channelID).createInvite().then(invite => msg.author.send(invite.url));
        
                    // Delete ticket from database.
                    delete orderDB[ticketID];
        
                    // Delete ticket from tickets channel.
                    api.client.channels.get("483743363909025806").fetchMessages({
                        around: order.ticketChannelMessageID,
                        limit: 1
                    }).then(messages => {
                        const fetchedMsg = messages.first();
        
                        fetchedMsg.delete();
                    });
                });
            }else {
                msg.reply("Please use this command in the <#483744285145956382> channel.");
                console.log(colors.red(`${msg.author.username} used the claim command in the wrong channel.`));
            }
        }else {
            msg.reply("You do not have access to this command.");
            console.log(colors.red(`${msg.author.username} did not have access to the deliver command.`));
        }
    });
};
