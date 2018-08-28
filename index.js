const BotCore = require('reputation-core');
const fs = require('fs');

let config = Object.assign({
	modulePath: "modules",
    token: "shhhh"
}, JSON.parse(fs.readFileSync('config.json')));
let bot = new BotCore(config);

// Invite: https://discordapp.com/oauth2/authorize?client_id=483752759502307330&permissions=124929&scope=bot

bot.on('ready', () => {
    console.log(`Logged in as ${bot.client.user.tag}.`);
});
