const Discord = require(`discord.js`);
const config = require(`./config.json`);
const server = require(`steam-server-status`);

const client = new Discord.Client({
    disableMentions: "everyone"
});

client.once("ready", async () => {

    console.log(`Bot Started!`);
    client.user.setStatus("online");
    if (config.displayTotal === true) {
        setInterval(async () => {
            let serverCount = 0;
            await config.servers.forEach(item => {

                let arg = item.split(":");
                server.getServerStatus(arg[0], arg[1], async serverInfo => {
    
                    if (serverInfo.error) {
                        return;
                    } else {
                        serverCount = serverCount + serverInfo.numberOfPlayers;
                        client.user.setActivity(`${serverCount} Online Players!`);
                    }
    
                });
    
            });
        }, 5000)
    } else {
        const maxServers = config.servers.length - 1;
        var current = 0;

        setInterval(async () => {

            if (current > maxServers) {
                current = 0;

                let word = await config.servers[current].split(":");
                await server.getServerStatus(word[0], word[1], async info => {

                    if (info.error) {
                        return;
                    } else {
                        await client.user.setActivity(`${info.numberOfPlayers} Online Players!`);
                    }

                });
            } else {

                let word = await config.servers[current].split(":");
                await server.getServerStatus(word[0], word[1], async info => {

                    if (info.error) {
                        return;
                    } else {
                        await client.user.setActivity(`${info.numberOfPlayers} Online Players!`);
                    }

                });
            }

            current = current + 1;

        }, 5000)

    }


});

client.login(config.token);