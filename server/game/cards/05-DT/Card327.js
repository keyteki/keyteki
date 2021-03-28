const Card = require('../../Card.js');

class Card327 extends Card {
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

Card327.id = 'card-327';

module.exports = Card327;
