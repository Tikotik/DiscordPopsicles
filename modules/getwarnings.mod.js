const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "getwarnings";

exports.onLoad = api => {
	api.commands.add("getwarnings", (msg) => {
		let content = msg.content.substring(14);
		let server = content.substring(0, 18);

		fsn.readJSON("./warnings.json").then((warningDB) => {
			let entry = warningDB[server];

			if(!(entry === undefined)) {
				msg.channel.send(`${api.client.guilds.get(server).name} has ${entry.warnings} warnings.`);
			}else {
				msg.channel.send(`${api.client.guilds.get(server).name} has no warnings.`);
			}

		});

		// Logs in console.
		console.log(colors.green(`${msg.author.username} used the getWarnings command.`));
	});
};
