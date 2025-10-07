import Card from '../../Card.js';

class GanymedeOutpost extends Card {
    // Action: Put a friendly creature on the bottom of its owner's
    // deck. If you do, archive 2 cards.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                targets: {
                    cards: {
                        mode: 'exactly',
                        numCards: 2,
                        controller: 'self',
                        location: 'hand',
                        gameAction: ability.actions.archive()
                    }
                },
                message: '{0} uses {1} to archive 2 cards'
            }
        });
    }
}

GanymedeOutpost.id = 'ganymede-outpost';

export default GanymedeOutpost;
