import Card from '../../Card.js';

class D1V3Pod extends Card {
    // (T) While the tide is high, this creature gains skirmish.
    // (T) While the tide is low, this creature gains elusive.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });

        this.whileAttached({
            condition: (context) => context.player.isTideLow(),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

D1V3Pod.id = 'd1-v3-pod';

export default D1V3Pod;
