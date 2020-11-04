const { Collection } = require('discord.js');
const { PREFIX } = require('../../config')

module.exports = (client, message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).split(/ +/)
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
  if (!command) return;

  if (command.help.permissions && !message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('Tu n\'as pas les perms pour cette commande')

  if (command.help.args && !args.length) {
    let noArgsReply = `Il nous faut une suite pour cette commande ${message.author} !`
    if (command.help.usage) noArgsReply += `\nVoici comment utiliser la commande : \`${PREFIX}${command.help.name} ${command.help.usage}\``
    return message.channel.send(noArgsReply)
  }

  if (!client.cooldowns.has(command.help.name)) {
    client.cooldowns.set(command.help.name, new Collection());
  }

  const timeNow = Date.now();
  const tStamps = client.cooldowns.get(command.help.name);
  const cdAmount = (command.help.cooldown || 5) * 1000;
  
  if (tStamps.has(message.author.id)) {
    const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

    if(timeNow < cdExpirationTime) {
      timeLeft = (cdExpirationTime - timeNow) / 1000;
      return message.reply(`Merci d'attendre ${timeLeft.toFixed(0)} seconde(s) avent de ré-utiliser la commande \`${command.help.name}\`.`)
    };
  };
  tStamps.set(message.author.id, timeNow);
  setTimeout(() => tStamps.delete(message.author.id), cdAmount);

  command.run(client, message, args);
}