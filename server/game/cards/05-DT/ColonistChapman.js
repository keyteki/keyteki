import Card from '../../Card.js';

class ColonistChapman extends Card {
    // Taunt.
    // Each of Colonist Chapman's non-Star Alliance neighbors gains, "Reap: Gain 1A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) =>
                card.type === 'creature' &&
                context.source.neighbors.includes(card) &&
                !card.hasHouse('staralliance'),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.gainAmber()
            })
        });
    }
}

ColonistChapman.id = 'colonist-chapman';

export default ColonistChapman;
