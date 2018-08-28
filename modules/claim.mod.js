exports.id = 'claim';

exports.onLoad = api => {
    let regex = new RegExp("p!claim (.*)");

    api.commands.add('claim', (msg) => {
        // Get Ticket ID. The Ticket ID is ticket[1].
        ticket = regex.exec(msg.content);

        // Send's a messgae.
        msg.channel.send(":thumbsup: You've now claimed `" + ticket[1] + "`!");

        // Edits Ticket
        // TODO
    })
};
