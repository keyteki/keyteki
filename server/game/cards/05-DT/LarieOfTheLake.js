import Card from '../../Card.js';

class LarieOfTheLake extends Card {
    // (T) While the tide is high, each friendly creature gets +2 armor.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.isTideHigh(),
            match: (card) => card.type === 'creature',
            effect: ability.effects.modifyArmor(2)
        });
    }
}

LarieOfTheLake.id = 'lærie-of-the-lake';

export default LarieOfTheLake;
