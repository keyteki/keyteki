const _ = require('underscore');
const Card = require('../../Card.js');

class TechnoShade extends Card {
    // After Fight/After Reap: Your opponent shuffles a random card
    // from their hand into their deck.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.hand.length > 0,
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: _.shuffle(context.player.opponent.hand).slice(0, 1)
            })),
            effect: "shuffle a random card from {1}'s hand into their deck",
            effectArgs: (context) => [context.player.opponent]
        });
    }
}

TechnoShade.id = 'techno-shade';

module.exports = TechnoShade;
