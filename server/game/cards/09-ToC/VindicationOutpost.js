import Card from '../../Card.js';

class VindicationOutpost extends Card {
    // Action: Put a friendly creature on the bottom of its owner's
    // deck. If you do, make a token creature, ready it, and fight with it.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature, and ready and fight with it',
                then: {
                    gameAction: ability.actions.sequential([
                        ability.actions.ready((context) => ({
                            target: context.preThenEvent.card
                        })),
                        ability.actions.fight((context) => ({
                            target: context.preThenEvent.card
                        }))
                    ])
                }
            }
        });
    }
}

VindicationOutpost.id = 'vindication-outpost';

export default VindicationOutpost;
