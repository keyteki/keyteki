import Card from '../../Card.js';

class CupOfWater extends Card {
    // Play: Stun each Cyborg creature and each Robot creature.
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

export default CupOfWater;
