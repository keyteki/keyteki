import Card from '../../Card.js';

class GreyAugur extends Card {
    // Each of Grey Augur's neighbors gains, "Fight: Gain 1A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.gainAmber()
            })
        });
    }
}

GreyAugur.id = 'grey-augur';

export default GreyAugur;
