const Card = require('../../Card.js');

class Harmonia extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // After you play a creature, if there are more enemy creatures than friendly creatures, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
                    event.player === context.player &&
                    context.player.opponent
            },
            gameAction: ability.actions.gainAmber((context) => ({
                amount:
                    context.player.creaturesInPlay.length <
                    context.player.opponent.creaturesInPlay.length
                        ? 1
                        : 0
            }))
        });
    }
}

Harmonia.id = 'harmonia';

module.exports = Harmonia;
