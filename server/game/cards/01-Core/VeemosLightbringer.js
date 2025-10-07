import Card from '../../Card.js';

class VeemosLightbringer extends Card {
    // Play: Destroy each elusive creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each elusive creature',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasKeyword('elusive'))
            }))
        });
    }
}

VeemosLightbringer.id = 'veemos-lightbringer';

export default VeemosLightbringer;
