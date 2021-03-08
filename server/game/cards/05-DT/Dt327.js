const Card = require('../../Card.js');

class Dt327 extends Card {
    //Reap: Exhaust each enemy artifact.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.cardsInPlay.filter(
                    (card) => card.controller !== context.player && card.type === 'artifact'
                )
            }))
        });
    }
}

Dt327.id = 'dt327';

module.exports = Dt327;
