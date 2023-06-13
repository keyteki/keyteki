const Card = require('../../Card.js');

class OfferingToKiligog extends Card {
    // Omni: Destroy a friendly creature. If you do, choose a creature
    // in your discard pile. Place it facedown under Offering to
    // Kiligog.
    //
    // Omni: Make each card under Offering to Killigog a token
    // creature as if the card was on top of your deck.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    location: 'discard',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.placeUnder({
                        parent: this,
                        facedown: true
                    })
                },
                message: '{0} uses {1} to place {3} under {1}',
                messageArgs: (context) => [context.target]
            }
        });

        this.omni({
            gameAction: ability.actions.sequentialForEach((context) => ({
                forEach: context.source.childCards,
                action: (card) =>
                    ability.actions.makeTokenCreature((context) => ({
                        target: context.player,
                        amount: 1,
                        cards: [card],
                        cardLocation: 'under'
                    }))
            })),
            message: '{0} uses {1} to make {2} token creature{3}',
            messageArgs: (context) => [
                context.player,
                context.source,
                context.source.childCards.length,
                context.source.childCards.length !== 1 ? 's' : ''
            ]
        });
    }
}

OfferingToKiligog.id = 'offering-to-kiligog';

module.exports = OfferingToKiligog;
