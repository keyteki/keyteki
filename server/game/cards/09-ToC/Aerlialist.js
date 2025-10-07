import Card from '../../Card.js';

class Aerialist extends Card {
    // While your yellow key is forged, Aerialist gains, “After Reap:
    // Capture 1A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.keys.yellow,
            targetController: 'current',
            match: (card, context) => card === context.source,
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.capture()
            })
        });
    }
}

Aerialist.id = 'aerialist';

export default Aerialist;
