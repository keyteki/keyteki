import Card from '../../Card.js';

class AzureBasinOutpost extends Card {
    // Action: Put a friendly creatue on the bottom of its owner's deck. If you do, exhaust 3 enemy creatures.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                target: {
                    mode: 'exactly',
                    numCards: 3,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.exhaust()
                }
            }
        });
    }
}

AzureBasinOutpost.id = 'azure-basin-outpost';

export default AzureBasinOutpost;
