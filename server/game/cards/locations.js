const _ = require('underscore');

var locations = {};

function factionCostReductionLocation(factionCode) {
    return {
        register: function(game, player, card) {

            var implementation = new FactionCostReduction(player, card, factionCode);

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

// 01039 - The Kingsroad
class TheKingsRoad {
    constructor(player, card) {
        this.player = player;
        this.card = card;

        card.initiative = 1;

        this.cardClick = this.cardClick.bind(this);
        this.beforeCardPlayed = this.beforeCardPlayed.bind(this);
        this.afterCardPlayed = this.afterCardPlayed.bind(this);
        this.cardsStanding = this.cardsStanding.bind(this);
    }

    cardClick(game, player, card) {
        if (this.player !== player || this.card.uuid !== card.uuid) {
            return;
        }

        if (player.phase !== 'marshal') {
            return;
        }

        var cardInPlay = _.find(player.cardsInPlay, c => {
            return c.card.uuid === card.uuid;
        });

        if (!cardInPlay || cardInPlay.kneeled) {
            return;
        }

        cardInPlay.kneeled = true;
        game.clickHandled = true;

        player.discardCard(card);

        game.addMessage(player.name + ' scarifices ' + card.label + ' to reduce the cost of the next character they marshal by 3');        

        this.active = true;
    }

    beforeCardPlayed(game, player, card) {
        if (this.player !== player) {
            return;
        }

        if (this.active && !this.abilityUsed && card.type_code === 'character' && card.cost > 0) {
            this.cost = card.cost;
            
            card.cost -= 3;
            if (card.cost < 0) {
                card.cost = 0;
            }

            this.abilityUsed = true;

            game.addMessage(player.name + ' uses ' + this.card.label + ' to reduce the cost of ' + card.label + ' by 3');
        }
    }

    afterCardPlayed(game, player, card) {
        if (this.card !== card) {
            return;
        }

        card.cost = this.cost;
    }

    cardsStanding() {
        this.abilityUsed = false;
        this.active = false;
    }
}
locations['01039'] = {
    register: function(game, player, card) {
        var implementation = new TheKingsRoad(player, card);

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

// 01040 - The Roseroad
class TheRoseRoad {
    constructor(player, card) {
        this.player = player;
        this.card = card;

        this.beginMarshal = this.beginMarshal.bind(this);
    }

    beginMarshal(game, player) {
        if (this.player !== player) {
            return;
        }

        player.gold++;

        game.addMessage(player.name + ' gained 1 gold from ' + this.card.label);
    }
}
locations['01040'] = {
    register: function(game, player, card) {
        var implementation = new TheRoseRoad(player, card);

        game.playerCards[player.id + card.uuid] = implementation;
        game.on('beginMarshal', implementation.beginMarshal);
    },
    unregister: function(game, player, card) {
        var implementation = game.playerCards[player.id + card.uuid];

        game.removeListener('beginMarshal', implementation.beginMarshal);
    }
};

class FactionCostReduction {
    constructor(player, card, factionCode) {
        this.player = player;
        this.card = card;
        this.factionCode = factionCode;

        this.cardClick = this.cardClick.bind(this);
        this.beforeCardPlayed = this.beforeCardPlayed.bind(this);
        this.afterCardPlayed = this.afterCardPlayed.bind(this);
        this.cardsStanding = this.cardsStanding.bind(this);
    }

    cardClick(game, player, card) {
        if (this.player !== player || this.card.uuid !== card.uuid) {
            return;
        }

        if (player.phase !== 'marshal') {
            return;
        }

        var cardInPlay = _.find(player.cardsInPlay, c => {
            return c.card.uuid === card.uuid;
        });

        if (!cardInPlay || cardInPlay.kneeled) {
            return;
        }

        cardInPlay.kneeled = true;
        game.clickHandled = true;
        this.active = true;
    }

    beforeCardPlayed(game, player, card) {
        if (this.player !== player) {
            return;
        }

        if (this.active && !this.abilityUsed && card.faction_code === this.factionCode && card.cost > 0) {
            card.cost -= 1;
            this.abilityUsed = true;
            this.cost = card.cost;

            game.addMessage(player.name + ' uses ' + this.card.label + ' to reduce the cost of ' + card.label + ' by 1');
        }
    }

    afterCardPlayed(game, player, card) {
        if (this.card !== card) {
            return;
        }

        card.cost = this.cost;
    }

    cardsStanding() {
        this.abilityUsed = false;
        this.active = false;
    }
}

// 01059 - Dragonstone Port
locations['01059'] = factionCostReductionLocation('baratheon');

// 01080 - Sea Tower
locations['01080'] = factionCostReductionLocation('greyjoy');

// 01099 - Western Fiefdom
locations['01099'] = factionCostReductionLocation('lannister');

// 01118 - Blood Orange Grove
locations['01118'] = factionCostReductionLocation('martell');

// 01156 - Heart Tree Grove
locations['01156'] = factionCostReductionLocation('stark');

// 01175 - Illyrio's Estate
locations['01175'] = factionCostReductionLocation('targaryen');

// 01194 - Rose Garden
locations['01194'] = factionCostReductionLocation('tyrell');

module.exports = locations;
