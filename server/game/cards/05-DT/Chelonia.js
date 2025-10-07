import Card from '../../Card.js';

class Chelonia extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // (T) After you play another creature, if the tide is high, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    event.card.type === 'creature' &&
                    event.card !== context.source
            },
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.gainAmber()
        });
    }
}

Chelonia.id = 'chelonia';

export default Chelonia;
