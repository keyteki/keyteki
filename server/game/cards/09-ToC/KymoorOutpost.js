import Card from '../../Card.js';

class KymoorOutpost extends Card {
    // Action: Put a friendly creature on the bottom of its owner's deck.
    // If you do, steal 1A and make a token creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                gameAction: [ability.actions.steal(), ability.actions.makeTokenCreature()],
                message: '{0} uses {1} to steal 1 amber and make a token creature'
            }
        });
    }
}

KymoorOutpost.id = 'kymoor-outpost';

export default KymoorOutpost;
