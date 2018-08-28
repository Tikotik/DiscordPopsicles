exports.id = 'order';

exports.onLoad = api => {
    let regex = new RegExp("p!order (.*)");
    
    api.commands.add('order', (msg) => {
        // Get order. The order is order[1].
        order = regex.exec(msg.content);

        // Sends an embed.
        msg.channel.send({embed: {
            color: "3447003",
            title: "Ticket Created",
            description: "Your order has been placed!",
            fields: [{
                name: "Your Ticket ID",
                value: "`EXAMPLE`"
              }],
            timestamp: new Date(),
        }});

        // Sends ticket.
        api.client.guilds.get("483736796354576394").channels.get("483743363909025806").send({embed: {
            color: "3447003",
            title: msg.author.username,
            fields: [{
                name: ":ticket: New Ticket",
                value: msg.author.username + " would like a popsicle.",
            },
            {
                name: ":newspaper2: Popsicle Description",
                value: order[1],
            },
            {
                name: ":hash: Ticket ID",
                value: "EXAMPLE",
            },
            {
                name: ":computer: Guild Infomation",
                value: "This ticket came from " + msg.guild + " (" + msg.guild.id+ ")" + " in " + msg.channel + " (" + msg.channel.id + ").",
            },
            {
                name: ":white_check_mark: Ticket Status",
                value: "Unclaimed", 
            }],
            timestamp: new Date(),
            footer: {
                text: "Discord Popsicles"
            }
        }});
    });
};
