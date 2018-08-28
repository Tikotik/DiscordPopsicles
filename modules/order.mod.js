exports.id = 'order';

exports.onLoad = api => {
    let regex = new RegExp("p!order (.*)");
    
    api.commands.add('order', (msg) => {
        // Get Order. The order is order[1].
        order = regex.exec(msg.content);

        // Sends an embed.
        msg.channel.send({embed: {
            color: "3447003",
            title: "Ticket Created",
            description: "Your order has been placed!",
            fields: [{
                name: "Your Ticket ID",
                value: "`EXAMPLE`"
              }
            ],
            timestamp: new Date(),
        }});

        // Sends Ticket
        // api.guilds.get(483736796354576394).channels.get(483743363909025806).send("Hello")
    });
};
