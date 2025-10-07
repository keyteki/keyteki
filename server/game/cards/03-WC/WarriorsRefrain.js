import Card from '../../Card.js';

class WarriorsRefrain extends Card {
    // Play: Stun each creature with power 3 or lower.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.stun((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.power <= 3)
            }))
        });
    }
}

WarriorsRefrain.id = 'warriors--refrain';

export default WarriorsRefrain;
