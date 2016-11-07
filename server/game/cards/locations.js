const _ = require('underscore');

var locations = {};

// 01040 - The Roseroad
class TheRoseRoad {
    constructor(player, card) {
        this.player = player;
        this.card = card;

        this.beginMarshal = this.beginMarshal.bind(this);
    }

    beginMarshal(game, player) {
        if(this.player !== player) {
            return;
        }

        player.gold++;

        game.addMessage(player.name + ' gained 1 gold from ' + this.card.label);
    }
}
locations['01040'] = {
    register: function(game, player, card) {
        var implementation = new TheRoseRoad(player, card);

        game.playerCards[player.id + card.code] = implementation;
        game.on('beginMarshal', implementation.beginMarshal);
    },
    unregister: function(game, player, card) {
        var implementation = game.playerCards[player.id + card.code];

        game.removeListener('beginMarshal', implementation.beginMarshal);
    }
};

// 01156 - Heart Tree Grove
class HeartTreeGrove {
    constructor(player, card) {
        this.player = player;
        this.card = card;

        this.cardClick = this.cardClick.bind(this);
        this.beforeCardPlayed = this.beforeCardPlayed.bind(this);
        this.afterCardPlayed = this.afterCardPlayed.bind(this);
        this.cardsStanding = this.cardsStanding.bind(this);
    }

    cardClick(game, player, card) {
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
    }

    beforeCardPlayed(game, player, card) {
        if(this.player !== player) {
            return;
        }

        if(this.active && !this.abilityUsed && card.faction_code === 'stark' && card.cost > 0) {
            card.cost -= 1;
            this.abilityUsed = true;
            this.cost = card.cost;

            game.addMessage(player.name + ' uses ' + this.card.label + ' to reduce the cost of ' + card.label + ' by 1');
        }
    }

    afterCardPlayed(game, player, card) {
        if(this.card !== card) {
            return;
        }

        card.cost = this.cost;
    }

    cardsStanding(game) {
        this.abilityUsed = false;
        this.active = false;
    }
}
locations['01156'] = {
    register: function(game, player, card) {

        var implementation = new HeartTreeGrove(player, card);

        game.playerCards[player.id + card.code] = implementation;

        game.on('cardClicked', implementation.cardClick);
        game.on('beforeCardPlayed', implementation.beforeCardPlayed);
        game.on('afterCardPlayed', implementation.afterCardPlayed);
        game.on('cardsStanding', implementation.cardsStanding);
    },
    unregister: function(game, player, card) {
        var implementation = game.playerCards[player.id + card.code];

        game.removeListener('cardClicked', implementation.cardClick);
        game.removeListener('beforeCardPlayed', implementation.beforeCardPlayed);
        game.removeListener('afterCardPlayed', implementation.afterCardPlayed);
        game.removeListener('cardsStanding', implementation.cardsStanding);
    }
};

module.exports = locations;
