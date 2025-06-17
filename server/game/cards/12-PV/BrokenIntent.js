const Card = require('../../Card.js');

class BrokenIntent extends Card {
    // Play: Choose one:
    // Each player discards their archives.
    // Purge an action card in a discard pile.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Discard archives': ability.actions.discard((context) => ({
                            target: context.player.archives.concat(
                                context.player.opponent ? context.player.opponent.archives : []
                            )
                        })),
                        'Purge action': () => true
                    }
                },
                'Purge action': {
                    dependsOn: 'action',
                    cardType: 'action',
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

BrokenIntent.id = 'broken-intent';

module.exports = BrokenIntent;
