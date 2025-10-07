import Card from '../../Card.js';

class DimoElderghast extends Card {
    // Each friendly creature with A on it gains, “Destroyed: If you
    // are haunted, gain 1 A for each A on this creature.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.type === 'creature' && card.amber > 0 && card.controller.isHaunted(),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.gainAmber((context) => ({
                    target: context.source.controller,
                    amount: context.source.amber
                }))
            })
        });
    }
}

DimoElderghast.id = 'dimo-elderghast';

export default DimoElderghast;
