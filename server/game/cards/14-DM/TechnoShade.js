const { shuffle } = require('../../../Array.js');
const Card = require('../../Card.js');

class TechnoShade extends Card {
    // After Fight/After Reap: Your opponent shuffles a random card from their hand into their deck.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.hand.length > 0,
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: shuffle(context.player.opponent ? context.player.opponent.hand : []).slice(
                    0,
                    1
                )
            }))
        });
    }
}

TechnoShade.id = 'techno-shade';

module.exports = TechnoShade;
