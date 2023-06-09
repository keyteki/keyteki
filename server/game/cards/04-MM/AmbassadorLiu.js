const Card = require('../../Card.js');

class AmbassadorLiu extends Card {
    // Action: Discard a card from your hand. If it is a Dis or Shadows card, steal 1A. If it is a Logos or Untamed card, gain 2A. If it is a Sanctum or Saurian card, capture 3A.
    setupCardAbilities(ability) {
        this.action({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.card.hasHouse('dis') ||
                    context.preThenEvent.card.hasHouse('shadows') ||
                    context.preThenEvent.card.hasHouse('logos') ||
                    context.preThenEvent.card.hasHouse('untamed') ||
                    context.preThenEvent.card.hasHouse('sanctum') ||
                    context.preThenEvent.card.hasHouse('saurian'),
                message: '{0} uses {1} to {3}',
                messageArgs: (context) => [
                    context.preThenEvent.card.hasHouse('dis') ||
                    context.preThenEvent.card.hasHouse('shadows')
                        ? 'steal 1 amber'
                        : context.preThenEvent.card.hasHouse('logos') ||
                          context.preThenEvent.card.hasHouse('untamed')
                        ? 'gain 2 amber'
                        : 'capture 3 amber'
                ],
                gameAction: [
                    ability.actions.steal((context) => ({
                        amount:
                            context.preThenEvent.card.hasHouse('dis') ||
                            context.preThenEvent.card.hasHouse('shadows')
                                ? 1
                                : 0
                    })),
                    ability.actions.gainAmber((context) => ({
                        amount:
                            context.preThenEvent.card.hasHouse('logos') ||
                            context.preThenEvent.card.hasHouse('untamed')
                                ? 2
                                : 0
                    })),
                    ability.actions.capture((context) => ({
                        amount:
                            context.preThenEvent.card.hasHouse('sanctum') ||
                            context.preThenEvent.card.hasHouse('saurian')
                                ? 3
                                : 0
                    }))
                ]
            }
        });
    }
}

AmbassadorLiu.id = 'ambassador-liu';

module.exports = AmbassadorLiu;
