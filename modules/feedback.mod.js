const colors = require("colors");

exports.id = "feedback";

exports.onLoad = api => {
    let regex = new RegExp("p!feedback (.*)");
    
    api.commands.add("feedback", (msg) => {
        // Get feedback. The feedback is feedback[1].
        let feedback = regex.exec(msg.content);

        // Sends an message.
        msg.channel.send("Thanks for the feedback! We really appreciate it.");

        // Sends feedback.
        api.client.guilds.get("483736796354576394").channels.get("483743412546175009").send({embed: {
            color: 0xFFFFFF,
            title: `New Feedback from ${msg.author.username} (${msg.author.id})`,
            description: feedback[1],
            timestamp: new Date(),
        }});

        // Logs in console.
        console.log(colors.green(`${msg.author.username} used the feedback command.`));
    });
};
