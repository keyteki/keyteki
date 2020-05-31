const Card = require('../../Card.js');

class EmpBlast extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'stun each Mars creature and each Robot creature and destroy all artifacts',
            gameAction: [
                ability.actions.stun((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.hasHouse('mars') || card.hasTrait('robot')
                    )
                })),
                ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay.filter((card) => card.type === 'artifact')
                }))
            ]
        });
    }
}

EmpBlast.id = 'emp-blast';

module.exports = EmpBlast;
