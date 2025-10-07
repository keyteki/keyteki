import Card from '../../Card.js';

class SeekerMissiles extends Card {
    // Play: Deal 2D to a creature for each Skyborn flank creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to a creature for each Skyborn flank creature',
            gameAction: ability.actions.allocateDamage((context) => ({
                damageStep: 2,
                numSteps: context.game.creaturesInPlay.filter(
                    (card) => card.hasHouse('skyborn') && card.isOnFlank()
                ).length
            }))
        });
    }
}

SeekerMissiles.id = 'seeker-missiles';

export default SeekerMissiles;
