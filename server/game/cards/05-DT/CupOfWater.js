const Card = require('../../Card.js');

class CupOfWater extends Card {
    //Play: Stun each cyborg creature and each robot creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.stun((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) => card.hasTrait('cyborg') || card.hasTrait('robot')
                )
            }))
        });
    }
}

CupOfWater.id = 'cup-of-water';

module.exports = CupOfWater;
