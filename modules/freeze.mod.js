const Discord = require("discord.js");
const fsn = require("fs-nextra");
const colors = require("colors");

exports.id = "freeze";

exports.onLoad = api => {
	api.commands.add("freeze", (msg) => {
		let employeeRole = msg.guild.roles.get("483739310269399051");

		if(msg.member.roles.has(employeeRole.id)) {
			if(msg.channel.id == 483744245237284875) {
				fsn.readJSON("./orders.json").then((orderDB) => {
					let ticketID = msg.content.substring(9);
					let order = orderDB[ticketID];

					// If the order doesn't exist.
					if(order === undefined) {
						msg.reply("Couldn't find that order. Try again!");

						return;
					}
                    
					// Checks status.
					if(msg.author.id === order.chef) {
						if (order.status === "Claimed") {
							msg.reply("The next message you send will be set as the order's image.");
    
							// Get the image URL.
							let imageURL = undefined;
                            
							const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 30000 });
							collector.on("collect", message => {
								imageURL = message.content;
      
								// Edits the message in the tickets channel.
								api.client.channels.get("483743363909025806").fetchMessages({
									around: order.ticketChannelMessageID,
									limit: 1
								}).then(messages => {
									const fetchedMsg = messages.first();
        
									// Edit the ticket in the tickets channel.
									fetchedMsg.edit({embed: {
										color: 0xFFFFFF,
										title: api.client.users.get(order.userID).username,
										fields: [{
											name: ":ticket: New Ticket",
											value: `${api.client.users.get(order.userID).username} would like a popsicle.`,
										}, {
											name: ":newspaper2: Popsicle Description",
											value: order.order,
										}, {
											name: ":hash: Ticket ID",
											value: ticketID,
										}, {
											name: ":computer: Guild Infomation",
											value: `This ticket came from ${api.client.guilds.get(order.guildID).name} (${order.guildID}) in #${api.client.channels.get(order.channelID).name} (${api.client.channels.get(order.channelID).id}).`,
										}, {
											name: ":white_check_mark: Ticket Status",
											value: "Freezing", 
										}],
										timestamp: new Date(),
										footer: {
											text: "Discord Popsicles"
										}
									}}).then((m) => {
										m = m.id;
        
										// Update Status
										delete orderDB[ticketID];
        
										orderDB[ticketID] = {
											"orderID": order.orderID,
											"userID": order.userID,
											"guildID": order.guildID,
											"channelID": order.channelID,
											"order": order.order,
											"status": "Freezing",
											"ticketChannelMessageID": m,
											"chef": msg.author.id,
											"imageURL": imageURL
										};
        
										// Writes Data to JSON.
										fsn.writeJSON("./orders.json", orderDB, {
											replacer: null,
											spaces: 4
										}).then(() => {
											// Sends a message to the cook.
											msg.channel.send(`:thumbsup: Alright, you've put \`${ticketID}\` into the freezer. It'll take **3 minutes** to freeze.`);
        
											// Sends a message to the customer.
											api.client.users.get(order.userID).send(":thumbsup: Your cook just put your ticket in the freezer! It should take **3 minutes** to cook!");
        
											// Starts freezing for 3 minutes.
											setTimeout(froze, 180000);
                                            
											// When done after 3 minutes.
											function froze() {
												console.log(colors.green(`${ticketID} is done freezing.`));
    
												// Update Status
												delete orderDB[ticketID];
                
												orderDB[ticketID] = {
													"orderID": order.orderID,
													"userID": order.userID,
													"guildID": order.guildID,
													"channelID": order.channelID,
													"order": order.order,
													"status": "Frozen",
													"ticketChannelMessageID": m,
													"chef": msg.author.id,
													"imageURL": imageURL
												};
    
												// Edits the message in the tickets channel.
												api.client.channels.get("483743363909025806").fetchMessages({
													around: order.ticketChannelMessageID,
													limit: 1
												}).then(messages => {
													const fetchedMsg = messages.first();
    
													fetchedMsg.edit({embed: {
														color: 0xFFFFFF,
														title: api.client.users.get(order.userID).username,
														fields: [{
															name: ":ticket: New Ticket",
															value: `${api.client.users.get(order.userID).username} would like a popsicle.`,
														}, {
															name: ":newspaper2: Popsicle Description",
															value: order.order,
														}, {
															name: ":hash: Ticket ID",
															value: ticketID,
														}, {
															name: ":computer: Guild Infomation",
															value: `This ticket came from ${api.client.guilds.get(order.guildID).name} (${order.guildID}) in #${api.client.channels.get(order.channelID).name} (${api.client.channels.get(order.channelID).id}).`,
														}, {
															name: ":white_check_mark: Ticket Status",
															value: "Frozen", 
														}],
														timestamp: new Date(),
														footer: {
															text: "Discord Popsicles"
														}
													}});
												});
    
												// Writes Data to JSON.
												fsn.writeJSON("./orders.json", orderDB, {
													replacer: null,
													spaces: 4
												}).then(() => {
													// Send message to delivery channel.
													api.client.channels.get("483744285145956382").send(`Ticket \`${ticketID}\` has completed freezing and is ready to be delivered!`);
    
													// Sends a message to the customer.
													api.client.users.get(order.userID).send(":thumbsup: Your popsicle is frozen and will be delivered shortly!");
												}).catch((err) => {
													if (err) {
														msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``);   
													}
												});
											}
										}).catch((err) => {
											if (err) {
												msg.reply(`There was an error while writing to the database! Show the following message to a developer: \`\`\`${err}\`\`\``);
											}
										});
										console.log(colors.green(`${msg.author.username} started freezing ticket ${ticketID}.`));
									});
								});
							});
						}else if(order.status === "Unclaimed") {
							msg.reply("This order hasn't been claimed yet. Run `p!claim [Ticket ID]` to claim it.");
						}else if(order.status === "Freezing") {
							msg.reply("This order is already claimed and freezing right now. Wait a little bit, then run `p!deliver [Ticket ID]` in <#483744285145956382> to deliver.");
						}else if(order.status === "Frozen") {
							msg.reply("This order is already frozen and ready to be delivered. Run `p!deliver [Ticket ID]` in <#483744285145956382> to deliver.");
						}
					}else {
						msg.reply(`Only the chef of the order, ${api.client.users.get(order.chef).username} may freeze this order.`);
					}
				});  
			}else {
				msg.reply("Please use this command in the <#483744245237284875> channel.");
				console.log(colors.red(`${msg.author.username} used the freeze command in the wrong channel.`));
			}
		}else {
			msg.reply("You do not have access to this command.");
			console.log(colors.red(`${msg.author.username} did not have access to the freeze command.`));
		}
	});
};
