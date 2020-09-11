require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const token = process.env.TOKEN;

const client = new Discord.Client();
client.commands = new Discord.Collection();
let prefix = '!';

const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (let command of commands) {
	const action = require(`./commands/${command}`);
	client.commands.set(action.name, action);
}


client.on('ready', () => {
    console.log('bot is ready & running')
});


client.on('message', message => {
	// check if has prefix or if said by bot
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// set args and the command that is being exec
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	// check if command exists if not, then execute help command
	if (!client.commands.has(command)) {
		client.commands.get('help').execute(message, args);
		return;
	}

	// execute command
	client.commands.get(command).execute(message, args);
});

client.login(token);