const BotCore = require("reputation-core");
const fs = require("fs");
const colors = require("colors");
const http = require("http");
const express = require("express");
const app = express();

let config = Object.assign({
	modulePath: "modules",
    token: process.env.TOKEN
}, JSON.parse(fs.readFileSync('config.json')));
let bot = new BotCore(config);

// Invite: https://discordapp.com/oauth2/authorize?client_id=483752759502307330&permissions=124929&scope=bot

bot.on('ready', () => {
    console.log(colors.green(`Logged in as ${bot.client.user.tag}.`));
    console.log(colors.green(`In ${bot.client.guilds.size} Guilds.`))

    // Activityx    
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

    // Keep Awake
    app.get("/", (request, response) => {
        console.log(Date.now() + " Ping Received");
        response.sendStatus(200);
    });
    app.listen(process.env.PORT);
    setInterval(() => {
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);
});
