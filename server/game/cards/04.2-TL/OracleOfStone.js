const DrawCard = require('../../drawcard.js');

class OracleOfStone extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 2 cards, then discard 2 cards',
            gameAction: ability.actions.draw(context => ({
                target: context.game.getPlayers(),
                amount: 2
            })),
            then: context => ({
                gameAction: ability.actions.chosenDiscard({
                    target: context.game.getPlayers(),
                    amount: 2
                })
            })
        });
    }
}

OracleOfStone.id = 'oracle-of-stone';

module.exports = OracleOfStone;
