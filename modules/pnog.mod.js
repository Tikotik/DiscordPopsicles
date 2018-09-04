exports.id = "pnog";

exports.onLoad = api => {
    api.commands.add("pnog", (msg) => {
        msg.channel.send({embed: {
            "title": ":ping_pong: Pnog!",
            "description": `${api.client.ping} ms`
        }});

        console.log(`${msg.author.username} used the ping command.`);
    })
};
