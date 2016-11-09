const _ = require('underscore');

function getReducer(condition) {
    return {
        register: function(game, player, card) {

            var implementation = new Reducer(player, card, condition);

            game.playerCards[player.id + card.uuid] = implementation;

            game.on('cardClicked', implementation.cardClick);
            game.on('beforeCardPlayed', implementation.beforeCardPlayed);
            game.on('afterCardPlayed', implementation.afterCardPlayed);
            game.on('cardsStanding', implementation.cardsStanding);
        },
        unregister: function(game, player, card) {
            var implementation = game.playerCards[player.id + card.uuid];

            game.removeListener('cardClicked', implementation.cardClick);
            game.removeListener('beforeCardPlayed', implementation.beforeCardPlayed);
            game.removeListener('afterCardPlayed', implementation.afterCardPlayed);
            game.removeListener('cardsStanding', implementation.cardsStanding);
        }
    };
}

function factionCostReducer(factionCode) {
    return getReducer((player, card) => {
        return card.faction_code === factionCode;
    });
}

module.exports = {
    getReducer: getReducer,
    factionCostReducer: factionCostReducer
};

class Reducer {
    constructor(player, card, condition) {
        this.player = player;
        this.card = card;
        this.condition = condition;

        this.cardClick = this.cardClick.bind(this);
        this.beforeCardPlayed = this.beforeCardPlayed.bind(this);
        this.afterCardPlayed = this.afterCardPlayed.bind(this);
        this.cardsStanding = this.cardsStanding.bind(this);
    }

    cardClick(game, player, card) {
        if(this.player !== player || this.card.uuid !== card.uuid) {
            return;
        }

        if(player.phase !== 'marshal') {
            return;
        }

        var cardInPlay = _.find(player.cardsInPlay, c => {
            return c.card.uuid === card.uuid;
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

        if(this.active && !this.abilityUsed && this.condition(player, card) && card.cost > 0) {
            this.cost = card.cost;
            card.cost -= 1;
            this.abilityUsed = true;
            this.active = false;

            game.addMessage(player.name + ' uses ' + this.card.label + ' to reduce the cost of ' + card.label + ' by 1');
        }
    }

    afterCardPlayed(game, player, card) {
        if(this.card !== card) {
            return;
        }

        card.cost = this.cost;
    }

    cardsStanding() {
        this.abilityUsed = false;
        this.active = false;
    }
}
