exports.id = 'claim';

exports.onLoad = api => {
    api.commands.add('claim', (msg) => {
        // Get Ticket ID. The Ticket ID is ticket[1].
        let ticketID = msg.content.substring(7);

        // Send's a messgae.
        msg.channel.send(":thumbsup: You've now claimed `" + ticketID + "`!");

        // Edits Ticket
        // TODO

        // Claims Ticket
    });
};
