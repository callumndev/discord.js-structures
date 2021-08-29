<div align="center">
    <br />
    <h1>discord.js-structures</h1>
    <br />
    <a href="https://www.npmjs.com/package/discord.js-structures"><img src="https://img.shields.io/npm/v/discord.js-structures.svg" alt="NPM version" /></a>
</div>


## About

A package to bring back extendable structures in [discord.js](https://discord.js.org/) since they where removed in the new v13 update.

**NOTE: THIS PACKAGE MAY NOT FUNCTION THE SAME AS THE OLD WAY OF EXTENDING STRUCTURES DID IN THE `v12` VERSION OF THE `discord.js` PACKAGE. ALSO, NOTE THAT `discord.js-structures` MUST BE REQUIRED BEFORE THE `discord.js` PACKAGE ELSE IT WILL EXPERIENCE FAILURES TO EXTEND STRUCTURES.**

## Installation

**Node.js 16.6.0 or newer is required.**  

```sh-session
npm install discord.js-structures
```

## Example usage

Register two extendable structures for the Guild & User structures:
```js
const Structures = require('discord.js-structures');

Structures.extend('Guild', Guild => {
    class CoolGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.cool = true;
        }
    }
    
    return CoolGuild;
});

Structures.extend('User', User => {
    class MyCustomUser extends User {
        constructor(...args) {
            super(...args);
        }

        get tagWithID() {
            return `${this.tag} (${this.id})`
        }
    }

    return MyCustomUser;
});
```

Afterwards we can create a quite simple example bot & use said structures:
```js
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    const coolGuilds = client.guilds.cache.filter(guild => guild.cool == true);
    console.log(`There are ${coolGuilds.size} cool guilds!`);
});

client.on('messageCreate', message => console.log(`${message.author.tagWithID || message.author.tag} just said ${message.content}`))

client.login('token');
```

## Links

- [GitHub](https://github.com/LzzDev/discord.js-structures)
- [NPM](https://www.npmjs.com/package/discord.js-structures)
- [Discord API Discord server](https://discord.gg/discord-api)
- [Discord.js](https://discord.js.org/)
