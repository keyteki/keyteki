import Card from '../../Card.js';

class BartosTheRuiner extends Card {
    // Each non-Mars creature and artifact gains, “After this card is
    // used, destroy it.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) =>
                (card.type === 'creature' || card.type === 'artifact') && !card.hasHouse('mars'),
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onUseCard: (event, context) => event.card === context.source
                },
                gameAction: ability.actions.destroy((context) => ({
                    target: context.source
                }))
            })
        });
    }
}

BartosTheRuiner.id = 'bartos-the-ruiner';

export default BartosTheRuiner;
