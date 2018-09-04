exports.id = "pong";

exports.onLoad = api => {
    api.commands.add("pong", (msg) => {
        msg.channel.send({embed: {
            "title": ":ping_pong: Ping!",
            "description": `${api.client.ping} ms`
        }});

        console.log(`${msg.author.username} used the pong command.`);
    })
};
