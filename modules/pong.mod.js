const colors = require("colors");

exports.id = "pong";

exports.onLoad = api => {
	api.commands.add("pong", (msg) => {
		msg.channel.send({embed: {
			"title": ":ping_pong: Ping!",
			"description": `${Math.round(api.client.ping)} ms`
		}});

		// Logs in console.
		console.log(colors.green(`${msg.author.username} used the pong command.`));
	});
};
