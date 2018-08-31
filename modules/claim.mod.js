exports.id = 'claim';

exports.onLoad = api => {
    api.commands.add('claim', (msg) => {
        let ticketID = msg.content.substring(7);




        // Send's a message to the cook.
        msg.channel.send(":thumbsup: You've now claimed `" + ticketID + "`!");
    });
};
