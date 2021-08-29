const path = require('path');
const overrides = {};
const structures = [
    'GuildEmoji',
    'DMChannel',
    'TextChannel',
    'VoiceChannel',
    'CategoryChannel',
    'NewsChannel',
    'StoreChannel',
    'GuildMember',
    'Guild',
    'Message',
    'MessageReaction',
    'Presence',
    'ClientPresence',
    'VoiceState',
    'Role',
    'User',
];

function discordStructure(structure) {
    return require(path.resolve(require.resolve("discord.js").replace("index.js", `/structures/${structure}.js`)));
};

function override(structure, callback) {
    const fullPath = path.resolve(require.resolve("discord.js").replace("index.js", `/structures/${structure}.js`));
    const original = require(fullPath);
    const modified = callback(original);
    require.cache[fullPath].exports = overrides[fullPath] = modified;
    const dependencies = Object.keys(require.cache).filter(key => require.cache[key].children?.find(child => child.id === fullPath));
    for(const dependency of dependencies) {
        if(!overrides[dependency]) {
            delete require.cache[dependency];
            require(dependency);
        }
    }
}


/**
* An extendable structure:
* * **`GuildEmoji`**
* * **`DMChannel`**
* * **`TextChannel`**
* * **`VoiceChannel`**
* * **`CategoryChannel`**
* * **`NewsChannel`**
* * **`StoreChannel`**
* * **`GuildMember`**
* * **`Guild`**
* * **`Message`**
* * **`MessageReaction`**
* * **`Presence`**
* * **`ClientPresence`**
* * **`VoiceState`**
* * **`Role`**
* * **`User`**
* @typedef {string} ExtendableStructure
*/

/**
* Allows for the extension of built-in Discord.js structures that are instantiated by {@link BaseManager Managers}.
*/
class Structures {
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }
    
    /**
    * Retrieves a structure class.
    * @param {string} structure Name of the structure to retrieve
    * @returns {Function}
    */
    static get(structure) {
        if (!structures.includes(structure)) throw new RangeError(`"${structure}" is not a valid structure.`);
        if (typeof structure === 'string') return discordStructure(structure);
        throw new TypeError(`"structure" argument must be a string (received ${typeof structure})`);
    }
    
    /**
    * Extends a structure.
    * <warn> Make sure to extend all structures before instantiating your client.
    * Extending after doing so may not work as expected. </warn>
    * @param {ExtendableStructure} structure Name of the structure class to extend
    * @param {Function} extender Function that takes the base class to extend as its only parameter and returns the
    * extended class/prototype
    * @returns {Function} Extended class/prototype returned from the extender
    * @example
    * const Structures = require('discord.js-structures');
    *
    * Structures.extend('Guild', Guild => {
    *   class CoolGuild extends Guild {
    *     constructor(client, data) {
    *       super(client, data);
    *       this.cool = true;
    *     }
    *   }
    *
    *   return CoolGuild;
    * });
    */
    static extend(structure, extender) {
        if (!structures.includes(structure)) throw new RangeError(`"${structure}" is not a valid extensible structure.`);
        if (typeof extender !== 'function') {
            const received = `(received ${typeof extender})`;
            throw new TypeError(`"extender" argument must be a function that returns the extended structure class/prototype ${received}.`,);
        }
        
        const extended = extender(discordStructure(structure));
        if (typeof extended !== 'function') {
            const received = `(received ${typeof extended})`;
            throw new TypeError(`The extender function must return the extended structure class/prototype ${received}.`);
        }
        
        if (!(extended.prototype instanceof discordStructure(structure))) {
            const prototype = Object.getPrototypeOf(extended);
            const received = `${extended.name || 'unnamed'}${prototype.name ? ` extends ${prototype.name}` : ''}`;
            throw new Error('The class/prototype returned from the extender function must extend the existing structure class/prototype' + ` (received function ${received}; expected extension of ${discordStructure(structure).name}).`,);
        }
        
        override(structure, extender);
        
        return extended;
    }
}

module.exports = Structures;
