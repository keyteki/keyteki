import Card from '../../Card.js';

class OneEyedWilla extends Card {
    // (T) While the tide is high, One-Eyed Willa gains elusive and skirmish.
    // Fight: Steal 1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isTideHigh(),
            effect: [
                ability.effects.addKeyword({ elusive: 1 }),
                ability.effects.addKeyword({ skirmish: 1 })
            ]
        });

        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

OneEyedWilla.id = 'one-eyed-willa';

export default OneEyedWilla;
