const Card = require('../../Card.js');

class LegionsMarch extends Card {
    // Play: For the remainder of the turn, after you use a Dinosaur creature, deal 1D to each non-Dinosaur creature.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'deal 1 damage to each non-Dinosaur creature after using a Dinosaur creature for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onUseCard: (event) =>
                        event.context.player === context.player && event.card.hasTrait('dinosaur')
                },
                gameAction: ability.actions.dealDamage((damageContext) => {
                    return {
                        amount: 1,
                        target: damageContext.game.creaturesInPlay.filter(
                            (c) => !c.hasTrait('dinosaur')
                        )
                    };
                })
            }))
        });
    }
}

LegionsMarch.id = 'legion-s-march';

module.exports = LegionsMarch;
