exports.id = "help";

exports.onLoad = api => {
    api.commands.add("help", (msg) => {
        // Sends a message.
        msg.channel.send("Sent the DMs!");

        // Sends Embed
        msg.author.send({embed: {
            color: 3447003,
            title: "Discord Popsicles Help",
            fields: [{
                name: "d!help",
                value: "This message."
            },
            {
                name: "d!order [order]",
                value: "Sends a popsicle order to our staff to make and deliver it to you.\."
            },
            {
                name: "d!feedback [feedback]",
                value: "Gives us feedback."
            },
            {
                name: "d!tip",
                value: "Tips us an imaginary amount of money."
            },
            {
                name: "d!apply",
                value: "Soon."
            }]
        }});

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the help command.`));
    })
};
