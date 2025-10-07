import Card from '../../Card.js';

class REvolution extends Card {
    // This creature and each creature with the same name as it gain,
    // "After Reap: Deal 2 Damage icon to an enemy creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'any',
                match: (card, context) => context.source.name === card.name,
                effect: ability.effects.gainAbility('reap', {
                    target: {
                        controller: 'opponent',
                        cardType: 'creature'
                    },
                    gameAction: ability.actions.dealDamage((context) => ({
                        target: context.target,
                        amount: 2
                    }))
                })
            })
        });
    }
}

REvolution.id = 'r-evolution';

export default REvolution;
