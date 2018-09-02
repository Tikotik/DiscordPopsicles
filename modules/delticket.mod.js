exports.id = "delticket";

const fsn = require("fs-nextra");
const colors = require("colors");

exports.onLoad = api => {
    api.commands.add("delticket", (msg) => {
        let employeeRole = msg.guild.roles.get("483739310269399051");

        if(msg.member.roles.has(employeeRole.id)) {
            if(msg.channel.id == 483744245237284875) {
                let ticketID = msg.content.substring(12, 19);
                let reason = msg.content.substring(20);

                fsn.readJSON("./orders.json").then((orderDB) => {
                    const order = orderDB[ticketID];

                    if(reason === "") {
                        reason = "None Provided";
                    }
                    
                    // Deletes the ticket.
                    delete orderDB[ticketID];
                    
                    // Writes data to JSON.
                    fsn.writeJSON("./orders.json", orderDB, {
                        replacer: null,
                        spaces: 4
                    }).then(() => {
                        // Sends a message to the cook.
                        msg.channel.send(`:thumbsup: You've deleted the ticket \`${ticketID}\`!`); 
                        
                        // Sends a message to the customer.
                        api.client.users.get(order.userID).send(`:cry: Sorry, but your order was cancelled by **${msg.author.username}** due to the following reason: \`${reason}\`.`);
    
                        // Logs in console.
                        console.log(colors.red(`${msg.author.username} deleted ticket ${order.orderID}.`));
                    }).catch((err) => {
                        if (err) {
                            msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``)
                        }
                    });

                    // Deletes ticket from tickets channel.
                    api.client.channels.get("483743363909025806").fetchMessages({
                        around: order.ticketChannelMessageID,
                        limit: 1
                    }).then(messages => {
                        const fetchedMsg = messages.first();

                        fetchedMsg.delete();
                    });
                });
            }else {
                msg.reply("Please use this command in the <#483744245237284875> channel.");
                console.log(colors.red(`${msg.author.username} used the delticket command in the wrong channel.`));
            }
        }else {
            msg.reply("You do not have access to this command.");
            console.log(colors.red(`${msg.author.username} did not have access to the delticket command.`));
        }
    });
};
