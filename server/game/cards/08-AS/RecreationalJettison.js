const Card = require('../../Card.js');

class RecreationalJettison extends Card {
    // Play: Discard a card. Resolve its bonus icons as if you had
    // played it. If a yellow key is forged, repeat the preceding
    // effect.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.sequential([
                    ability.actions.discard(),
                    ability.actions.resolveBonusIcons()
                ])
            },
            effect: 'discard {1} from their hand and resolve its bonus icons',
            effectArgs: (context) => [context.target],
            then: {
                condition: (context) =>
                    context.player.keys.yellow ||
                    (context.player.opponent && context.player.opponent.keys.yellow),
                alwaysTriggers: true,
                target: {
                    controller: 'self',
                    location: 'hand',
                    gameAction: ability.actions.sequential([
                        ability.actions.discard(),
                        ability.actions.resolveBonusIcons()
                    ])
                },
                message:
                    '{0} uses {1} to repeat the preceding effect and discard {3} from their hand and resolve its bonus icons',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

RecreationalJettison.id = 'recreational-jettison';

module.exports = RecreationalJettison;
