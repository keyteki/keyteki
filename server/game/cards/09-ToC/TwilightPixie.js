import Card from '../../Card.js';

class TwilightPixie extends Card {
    // Each of Twilight Pixie’s non-Faerie neighbors gains, “After
    // Reap: Gain 1A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                context.source.neighbors.includes(card) && !card.hasTrait('faerie'),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.gainAmber()
            })
        });
    }
}

TwilightPixie.id = 'twilight-pixie';

export default TwilightPixie;
