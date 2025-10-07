import Card from '../../Card.js';

class NyyonOutpost extends Card {
    // Action: Put a friendly creature on the bottom of its owner's
    // deck. If you do, make 2 token creatures.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                gameAction: ability.actions.makeTokenCreature({ amount: 2 })
            }
        });
    }
}

NyyonOutpost.id = 'nyyon-outpost';

export default NyyonOutpost;
