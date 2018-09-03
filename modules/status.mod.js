exports.id = "status";

exports.onLoad = api => {
    api.commands.add("status", (msg) => {
        msg.reply("Command Coming Soon!")

        console.log(`${msg.author.username} used the status command.`);
    })
};
