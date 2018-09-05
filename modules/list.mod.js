const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "list";

exports.onLoad = api => {
    api.commands.add("list", (msg) => {
        msg.channel.send("Here's a list of the current orders and their status. Find out more information about an order by running `p!status [Ticket ID]`.");

        // List Orders
        fsn.readJSON("./orders.json").then((orderDB) => {
            for(let x in orderDB) {
                msg.channel.send(`\`${x}\`: ${orderDB[x].status}`);
            }
        });

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the lsit command.`));
    })
};
