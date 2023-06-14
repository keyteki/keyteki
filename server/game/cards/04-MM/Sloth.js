const Card = require('../../Card.js');

class Sloth extends Card {
    // At the end of your turn, if you did not use any creatures this turn, gain 1A for each friendly Sin creature.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) =>
                    context.player === this.game.activePlayer &&
                    context.game.cardsUsed.filter((card) => card.type === 'creature').length === 0
            },
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.creaturesInPlay.filter((card) => card.hasTrait('sin')).length
            }))
        });
    }
}

Sloth.id = 'sloth';

module.exports = Sloth;
