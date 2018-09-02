const isNumber = require("is-number");

exports.id = 'tip';

exports.onLoad = api => {
    let regex = new RegExp("p!tip (.*)");
    
    api.commands.add('tip', (msg) => {
        // Get tip. The tip is tip[1].
        let tip = regex.exec(msg.content);

        if(isNumber(tip[1])) {
            // Sends an message.
            msg.channel.send("Thanks for the tip!");

            // Sends tip.
            api.client.guilds.get("483736796354576394").channels.get("483743397082038302").send({embed: {
                color: "3447003",
                title: `${msg.author.username} left a tip!`,
                description: "$" + tip[1],
                timestamp: new Date(),
            }});
        }else {
            msg.channel.send(`${tip[1]} is not a valid number.`);
        }
    });
};
