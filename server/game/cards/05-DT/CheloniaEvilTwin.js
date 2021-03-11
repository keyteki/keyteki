const Card = require('../../Card.js');

class CheloniaEvilTwin extends Card {
    // If the tide is high, after you play another creature, your opponent loses 1A.
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

module.exports = CheloniaEvilTwin;
