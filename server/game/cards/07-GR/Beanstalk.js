import Card from '../../Card.js';

class Beanstalk extends Card {
    // Friendly Giant creatures enter play ready.
    //
    // Action: Search your deck and discard pile for a Giant creature,
    // reveal it, and put it into your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'any',
            match: (card) => card.type === 'creature' && card.hasTrait('giant'),
            effect: ability.effects.entersPlayReady()
        });

        this.action({
            gameAction: ability.actions.search({
                cardCondition: (card) => card.hasTrait('giant'),
                amount: 1
            })
        });
    }
}

Beanstalk.id = 'beanstalk';

export default Beanstalk;
