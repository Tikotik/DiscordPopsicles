exports.id = 'ping';

exports.onLoad = api => {
    api.commands.add('ping', (msg) => {
        msg.channel.send({embed: {
            "title": ":ping_pong: Pong!",
            "description": `${api.client.ping} ms`
        }});

        console.log(`${msg.author.username} used the ping command.`);
    })
};
