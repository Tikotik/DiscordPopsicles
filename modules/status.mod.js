const colors = require("colors");

exports.id = "status";

exports.onLoad = api => {
    api.commands.add("status", (msg) => {
        msg.reply("Command Coming Soon!")

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the status command.`));
    })
};
