const Card = require('../../Card.js');

class Sloth extends Card {
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
