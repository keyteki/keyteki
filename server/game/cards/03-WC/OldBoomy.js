const Card = require('../../Card.js');

class OldBoomy extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.reveal((context) => ({
                location: 'deck',
                target: context.player.deck[0]
            })),
            then: (thenContext) => {
                const topCard = thenContext.player.deck[0];
                return {
                    gameAction: [
                        ability.actions.dealDamage({
                            amount: topCard && topCard.hasHouse('brobnar') ? 2 : 0
                        }),
                        ability.actions.archive({ target: topCard })
                    ],
                    then: {
                        condition: () => topCard && !topCard.hasHouse('brobnar'),
                        target: {
                            player: 'self',
                            mode: 'select',
                            choices: {
                                'Reveal top card': ability.actions.resolveAbility({
                                    ability: thenContext.ability
                                }),
                                Stop: () => true
                            }
                        }
                    }
                };
            }
        });
    }
}

OldBoomy.id = 'old-boomy';

module.exports = OldBoomy;
