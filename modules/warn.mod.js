const colors = require("colors");
const fsn = require("fs-nextra");

exports.id = "warn";

exports.onLoad = api => {
    api.commands.add("warn", (msg) => {
        let content = msg.content.substring(7);
        let server = content.substring(0, 18);

        fsn.readJSON("./warnings.json").then((warningDB) => {
            let entry = warningDB[server];

            if(entry === undefined) {
                let totalWarnings = 1;

                // Set JSON information.
                warningDB[server] = {
                    warnings: totalWarnings
                }
                
                // Write JSON information.
                fsn.writeJSON("./warnings.json", warningDB, {
                    replacer: null,
                    spaces: 4
                });
            }else {
                let totalWarnings = entry.warnings + 1;
                
                // Set JSON information.
                warningDB[server] = {
                    warnings: totalWarnings
                }
                
                // Write JSON information.
                fsn.writeJSON("./warnings.json", warningDB, {
                    replacer: null,
                    spaces: 4
                });

            }
        });

        // Sends Message.
        msg.channel.send(`You gave ${api.client.guilds.get(server).name} a warning.`);
        
        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the warn command.`));
    })
};
