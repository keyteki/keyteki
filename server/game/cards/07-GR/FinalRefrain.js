const Card = require('../../Card.js');

class FinalRefrain extends Card {
    // Play: Put each creature from your discard pile into play ready,
    // then fight with them one at a time. Destroy each creature put
    // into play this way.
    setupCardAbilities(ability) {
        this.zombies = [];

        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.discard.filter((c) => c.type === 'creature').length > 0,
            gameAction: ability.actions.sequentialPutIntoPlay((context) => {
                this.zombies = context.player.discard.filter((c) => c.type === 'creature');
                return {
                    forEach: this.zombies,
                    ready: true
                };
            }),
            then: {
                gameAction: ability.actions.sequential([
                    ability.actions.sequentialFight(() => {
                        this.zombies = this.zombies.filter((c) => c.location === 'play area');
                        return {
                            forEach: this.zombies
                        };
                    }),
                    ability.actions.destroy(() => {
                        return {
                            target: this.zombies
                        };
                    })
                ]),
                message:
                    '{0} uses {1} to put {3} into play ready, fight with each one, and destroy each one',
                messageArgs: () => [this.zombies]
            }
        });
    }
}

FinalRefrain.id = 'final-refrain';

module.exports = FinalRefrain;
