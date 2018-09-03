exports.id = "servers";

exports.onLoad = api => {
    api.commands.add("servers", (msg) => {
        msg.channel.send(`I'm currently in **${api.client.guilds.size}** servers!`);

        console.log(`${msg.author.username} used the servers command.`);
    })
};
