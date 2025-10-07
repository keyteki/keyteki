import Card from '../../Card.js';

class IronHeidy extends Card {
    // While you are haunted, Iron Heidy and each of Iron Heidy's
    // neighbors get +2 armor.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            match: (card, context) =>
                card === context.source || context.source.neighbors.includes(card),
            effect: ability.effects.modifyArmor(2)
        });
    }
}

IronHeidy.id = 'iron-heidy';

export default IronHeidy;
