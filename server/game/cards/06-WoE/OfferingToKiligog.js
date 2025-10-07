import Card from '../../Card.js';

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
            gameAction: ability.actions.sequentialMakeTokenCreature((context) => ({
                forEach: context.source.childCards,
                cardLocation: 'under'
            }))
        });
    }
}

OfferingToKiligog.id = 'offering-to-kiligog';

export default OfferingToKiligog;
