import Card from '../../Card.js';

class SoulVial extends Card {
    // Each friendly creature with on it gains: “Destroyed: Archive
    // this creature.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature' && card.amber > 0,
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.archive((context) => ({
                    target: context.source
                }))
            })
        });
    }
}

SoulVial.id = 'soul-vial';

export default SoulVial;
