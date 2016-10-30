const _ = require('underscore');

var locations = {};

// 01040 - The Roseroad
locations['01040'] = {
    register: function(game, player, card) {
        game.on('beginMarshal', (game, player) => {
            player.gold++;

            game.addMessage(player.name + ' gained 1 gold from ' + card.label);
        });
    }
};

// 01156 - Heart Tree Grove
locations['01156'] = {
    register: function(game, player, card) {
        this.player = player;
        this.card = card;

        game.on('cardClicked', this.cardClick.bind(this));
        game.on('beforeCardPlayed', this.beforeCardPlayed.bind(this));
        game.on('afterCardPlayed', this.afterCardPlayed.bind(this));
        game.on('cardsStanding', this.cardsStanding.bind(this));
    },
    cardClick: function(game, player, card) {
        if(this.player !== player || this.card.code !== card.code) {
            return;
        }

        if(player.phase !== 'marshal') {
            return;
        }

        var cardInPlay = _.find(player.cardsInPlay, c => {
            return c.card.code === card.code;
        });

        if(!cardInPlay || cardInPlay.kneeled) {
            return;
        }

        cardInPlay.kneeled = true;
        game.clickHandled = true;
        this.active = true;
    },
    beforeCardPlayed: function(game, player, card) {
        if(this.player !== player) {
            return;
        }

        if(this.active && !this.abilityUsed && card.faction_code === 'stark' && card.cost > 0) {
            card.cost -= 1;
            this.abilityUsed = true;
            this.cost = card.cost;

            game.addMessage(player.name + ' uses ' + this.card.label + ' to reduce the cost of ' + card.label + ' by 1');
        }
    },
    afterCardPlayed: function(game, player, card) {
        if(this.card !== card) {
            return;
        }

        card.cost = this.cost;
    },
    cardsStanding: function(game) {
        this.abilityUsed = false;
        this.active = false;
    }
};

module.exports = locations;
