exports.id = 'ping';

exports.onLoad = api => {
    api.commands.add('ping', (msg) => {
        msg.channel.send(':ping_pong: Pong!');
        console.log();
    })
};