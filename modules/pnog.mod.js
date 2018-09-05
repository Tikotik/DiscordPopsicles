exports.id = "pnog";

exports.onLoad = api => {
    api.commands.add("pnog", (msg) => {
        msg.channel.send({embed: {
            "title": ":ping_pong: Pnog!",
            "description": `${api.client.ping} ms`
        }});

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the pnog command.`));
    })
};
