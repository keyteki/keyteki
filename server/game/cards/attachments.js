var attachments = {};

// 02004 - Lady
attachments['02004'] = {
    register: function(game) {
        game.on('beforeAttach', this.beforeAttach);
    },

    beforeAttach: function(game, player, target) {
        if(target.faction_code !== 'stark') {
            game.canAttach = false;
        }
    }
};

// 02112 - Drowned God's Blessing
attachments['02112'] = {
    register: function(game, player, card) {
        card.initiative = 1;
        // TODO: Character gains 'Drowned God' trait, immune to single target events.
    },
    unregister: function(game, player, card) {
    }
};

// 05020 - Shield of Lannisport
attachments['05020'] = {
    register: function(game, player, card) {
        card.income = 1;
        // TODO: Strength and renown
    },
    unregister: function(game, player, card) {
    }
};

module.exports = attachments;
