import Card from '../../Card.js';

class FiendishApprentice extends Card {
    // Play: For each friendly Dis creature, deal 3D to an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.allocateDamage((context) => ({
                cardCondition: (card, context) => card.controller !== context.player,
                damageStep: 3,
                numSteps: context.player.creaturesInPlay.filter((c) => c.hasHouse('dis')).length
            })),
            effect: 'to deal 3 damage to a creature for each friendly Dis creature'
        });
    }
}

FiendishApprentice.id = 'fiendish-apprentice';

export default FiendishApprentice;
