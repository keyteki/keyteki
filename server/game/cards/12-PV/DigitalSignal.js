const Card = require('../../Card.js');

class DigitalSignal extends Card {
    // Play: For each card in your opponent's archives, archive a card. Discard your opponent's archives.
    setupCardAbilities(ability) {
        this.play({
            effect: "archive {1} cards and discard {2} from {3}'s archives",
            effectArgs: (context) => [
                context.player.opponent.archives.length,
                context.player.opponent.archives,
                context.player.opponent
            ],
            condition: (context) =>
                context.player.opponent && context.player.opponent.archives.length > 0,
            target: {
                mode: 'exactly',
                numCards: (context) =>
                    context.player.opponent ? context.player.opponent.archives.length : 0,
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.archive()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.discard((context) => ({
                    target: context.player.opponent.archives
                }))
            }
        });
    }
}

DigitalSignal.id = 'digital-signal';

module.exports = DigitalSignal;
