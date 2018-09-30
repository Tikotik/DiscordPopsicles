const BotCore = require("reputation-core");
const fs = require("fs");
const colors = require("colors");

const Sentry = require("@sentry/node");
Sentry.init({ dsn: "https://3899f40a2ff74693b64687611fa73510@sentry.io/1284361" });

require("dotenv").config();

let config = Object.assign({
	modulePath: "modules",
	token: process.env.TOKEN
}, JSON.parse(fs.readFileSync("config.json")));
let bot = new BotCore(config);

// Invite: https://discordapp.com/oauth2/authorize?client_id=483752759502307330&permissions=124929&scope=bot

bot.on("ready", () => {
	console.log(colors.green(`Logged in as ${bot.client.user.tag}.`));
	console.log(colors.green(`In ${bot.client.guilds.size} Guilds.`));

	// Activities  
	const activities_list = [
		"Making Popsicles", 
		"Eating Popsicles",
		"p!help", 
		"p!order Popsicles",
		`in ${bot.client.guilds.size} Guilds`
	];
    
	setInterval(() => {
		const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
		bot.client.user.setActivity(activities_list[index]);
	}, 10000);

	//Joined Guild
	bot.client.on("guildCreate", (guild) => {   
		console.log(colors.green(`Joined New Guild, ${guild.name}`));
	});

	//Left Guild
	bot.client.on("guildDelete", (guild) => {
		console.log(colors.green(`Left Guild, ${guild.name}`));
	});
});
