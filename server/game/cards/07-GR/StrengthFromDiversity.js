import Card from '../../Card.js';

class StrengthFromDiversity extends Card {
    // Play: Each friendly non-Star Alliance creature captures 1.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.player.creaturesInPlay.filter((c) => !c.hasHouse('staralliance'))
            })),
            effect: 'make each friendly non-Star Alliance creature capture 1 amber'
        });
    }
}

StrengthFromDiversity.id = 'strength-from-diversity';

export default StrengthFromDiversity;
