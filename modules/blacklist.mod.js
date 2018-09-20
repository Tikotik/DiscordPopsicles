const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "blacklist";

exports.onLoad = api => {
    api.commands.add("blacklist", (msg) => {
        let content = msg.content.substring(12);
        let server = content.substring(0, 18);

        fsn.readJSON("./blacklist.json").then((blacklistDB) => {
            let entry = blacklistDB[server];

            if(entry === undefined) {
                // Set JSON information.
                blacklistDB[server] = {
                    blacklisted: true
                }
                
                // Write JSON information.
                fsn.writeJSON("./blacklist.json", blacklistDB, {
                    replacer: null,
                    spaces: 4
                });

                msg.channel.send(`You have blacklisted ${api.client.guilds.get(server).name}!`);
            }else {
                msg.channel.send("This server is already blacklisted.");
            }
        });
        
        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the blacklist command.`));
    })
};
