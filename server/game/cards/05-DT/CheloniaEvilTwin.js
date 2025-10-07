import Card from '../../Card.js';

class CheloniaEvilTwin extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // (T) After you play another creature, if the tide is high, your opponent loses 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card !== context.source &&
                    event.card.type === 'creature' &&
                    event.player === context.player &&
                    context.player.isTideHigh()
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

CheloniaEvilTwin.id = 'chelonia-evil-twin';

export default CheloniaEvilTwin;
