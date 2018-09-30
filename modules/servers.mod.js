const colors = require("colors");

exports.id = "servers";

exports.onLoad = api => {
	api.commands.add("servers", (msg) => {
		msg.channel.send(`I'm currently in **${api.client.guilds.size}** servers!`);

		// Logs in console.
		console.log(colors.green(`${msg.author.username} used the servers command.`));
	});
};
