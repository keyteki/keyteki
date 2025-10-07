import Card from '../../Card.js';

class GreyAugurEvilTwin extends Card {
    // Each of Grey Augur's neighbors gains, "Reap: Gain 1A and exalt this creature."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('reap', {
                effect: 'gain 1 amber and exalt {0}',
                gameAction: [ability.actions.gainAmber(), ability.actions.exalt()]
            })
        });
    }
}

GreyAugurEvilTwin.id = 'grey-augur-evil-twin';

export default GreyAugurEvilTwin;
