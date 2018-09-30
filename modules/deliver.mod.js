exports.id = "deliver";

const fsn = require("fs-nextra");
const colors = require("colors");

exports.onLoad = api => {
	api.commands.add("deliver", (msg) => {
		let employeeRole = msg.guild.roles.get("483739310269399051");

		if(msg.member.roles.has(employeeRole.id)) {
			if(msg.channel.id == 483744285145956382) {
				fsn.readJSON("./orders.json").then((orderDB) => {
					let ticketID = msg.content.substring(10);
					let order = orderDB[ticketID];

					// If the order doesn't exist.
					if(order === undefined) {
						msg.reply("Couldn't find that order. Try again!");

						return;
					}
                    
					// Checks status.
					if (order.status === "Frozen") {
						// Delete ticket from database.
						delete orderDB[ticketID];

						// Writes data to JSON.
						fsn.writeJSON("./orders.json", orderDB, {
							replacer: null,
							spaces: 4
						}).then(() => {
							// If bot has create instant invite permission.
							if(api.client.guilds.get(order.guildID).me.hasPermission("CREATE_INSTANT_INVITE")) {
								// Send message to cook.
								msg.reply("I've DM'd you information about this order! :thumbsup:");
                    
								// Direct message cook.
								msg.author.send({embed: {
									fields: [{
										name: "Delivery Info",
										value: "The ticket has been deleted, it's all on you now."
									}, {
										name: "Ticket Description",
										value: order.order
									}, {
										name: "User Information",
										value: `${api.client.users.get(order.userID).username} (${api.client.users.get(order.userID).id}) in ${api.client.channels.get(order.channelID).name} (${api.client.channels.get(order.channelID).id}).`
									}, {
										name: "Cook's Image",
										value: order.imageURL
									}],
									timestamp: new Date()
								}});
                                
								// Get invite.
								api.client.channels.get(order.channelID).createInvite().then(invite => msg.author.send(invite.url));
							}else {
								// Bot delivers it's self.
								api.client.channels.get(order.channelID).send(`It seems that this bot doesn't have the correct permissions to generate an invite for your server. Please enable this for next time. Here is your popsicle that you ordered. Remember you can do \`d!tip [Amount]\` to give us virtual tips, and \`d!feedback [Feedback]\` to give us feedback on how we did. ${order.imageURL}`);

								// Sends message to cooks.
								msg.reply(`The bot did not have the Create Instant Invite Permissions for ${api.client.guilds.get(order.guildID).name}, so it delivered the popsicle itself.`);
                                
								// Logs in console.
								console.log(colors.green(`The bot did not have the Create Instant Invite Permissions for ${api.client.guilds.get(order.guildID).name}, so it delivered the popsicle itself.`));
							}

							// Delete ticket from tickets channel.
							api.client.channels.get("483743363909025806").fetchMessages({
								around: order.ticketChannelMessageID,
								limit: 1
							}).then(messages => {
								const fetchedMsg = messages.first();
                
								fetchedMsg.delete();
							});
						}).catch((err) => {
							if (err) {
								msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``);
							}
						});
					}else if(order.status === "Unclaimed") {
						msg.reply("This order hasn't been claimed yet. Run `p!claim [Ticket ID]` to claim it.");
					}else if(order.status === "Claimed") {
						if(msg.author.id === order.chef) {
							msg.reply("This order hasn't been frozen yet and is still claimed by you. Use `p!freeze [Ticket ID]` to start freezing it.");
						}else {
							msg.reply(`This order hasn't been frozen yet, and only the chef of the order, ${api.client.users.get(order.chef).username} may freeze this order.`);
						}
					}else if(order.status === "Freezing") {
						msg.reply("This order is freezing right now. Wait a little bit, then run `p!deliver [Ticket ID]` in <#483744285145956382> to deliver.");
					}
				});
			}else {
				msg.reply("Please use this command in the <#483744285145956382> channel.");
				console.log(colors.red(`${msg.author.username} used the claim command in the wrong channel.`));
			}
		}else {
			msg.reply("You do not have access to this command.");
			console.log(colors.red(`${msg.author.username} did not have access to the deliver command.`));
		}
	});
};
