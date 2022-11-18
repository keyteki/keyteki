const Card = require('../../Card.js');

class ColonelMariana extends Card {
    //Play: Each friendly Knight captures 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.game.cardsInPlay.filter(
                    (card) => card.controller === context.player && card.hasTrait('knight')
                ),
                amount: 1
            }))
        });
    }
}

ColonelMariana.id = 'colonel-mariana';

module.exports = ColonelMariana;
