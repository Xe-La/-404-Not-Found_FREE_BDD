/////////////////////////////////////////////////////
// VARIABLES
/////////////////////////////////////////////////////

const { Client } = require('discord.js');
const { loadCommands, loadEvents } = require('./Util/loader')
const client = new Client();
const configs = require("./configs.json");
client.config = configs;

/////////////////////////////////////////////////////
// HANDLER COMMANDS ET EVENTS (A NE PAS MODIFIER)
/////////////////////////////////////////////////////

loadCommands(client);
loadEvents(client);

/////////////////////////////////////////////////////
// FONCTION (A NE PAS MODIFIER)
/////////////////////////////////////////////////////

function activity() {
  setTimeout(() => {
    fivereborn.query(configs.serverInfo[0], configs.serverInfo[1], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        client.user.setActivity(" online " + data.clients + "/" + data.maxclients, { type: configs.activityType });
      }
    });
    activity();
  }, 10000);
}
activity();

/////////////////////////////////////////////////////
// DEMARRER LE BOT
/////////////////////////////////////////////////////

client.login(configs.token)