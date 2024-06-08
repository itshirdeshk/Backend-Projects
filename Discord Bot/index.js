import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("create")) {
        const url = message.content.split('create')[1];
        return message.reply({
            content: "Generating Short ID for " + url
        })
    }
    message.reply({
        content: "Hii from Bot"
    })
})

client.on("interactionCreate", interaction => {
    console.log(interaction);
    interaction.reply("PONG!!")
})

client.login(process.env.TOKEN);