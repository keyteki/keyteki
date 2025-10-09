const Card = require('../../Card.js');

class AerialPedlar extends Card {
    // After Reap: Take control of the least powerful enemy
    // creature. You may use that creature this turn. Give control of
    // Aerial Pedlar to your opponent.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'leastStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: [
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player)
                    })),
                    ability.actions.forRemainderOfTurn((context) => ({
                        effect: ability.effects.canUse(
                            (card) => context.target && context.target.includes(card)
                        )
                    }))
                ]
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => !!context.player.opponent,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    target: context.source,
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            }
        });
    }
}

AerialPedlar.id = 'aerial-pedlar';

module.exports = AerialPedlar;
