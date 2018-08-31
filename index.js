const BotCore = require('reputation-core');
const fs = require('fs');
const colors = require("colors");

let config = Object.assign({
	modulePath: "modules",
    token: "token"
}, JSON.parse(fs.readFileSync('config.json')));
let bot = new BotCore(config);

// Invite: https://discordapp.com/oauth2/authorize?client_id=483752759502307330&permissions=124929&scope=bot

bot.on('ready', () => {
    console.log(colors.green(`Logged in as ${bot.client.user.tag}.`));

    // Activityx    
    const activities_list = [
        "Making Popsicles", 
        "Eating Popsicles",
        "p!help", 
        "p!order Popsicles"
    ];
    
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
        bot.client.user.setActivity(activities_list[index]);
    }, 10000);
});
