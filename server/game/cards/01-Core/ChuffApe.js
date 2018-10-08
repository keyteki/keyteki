const Card = require('../../Card.js');

class ChuffApe extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.stun()
        });
        
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) =>  card !== context.source,
                gameAction: ability.actions.sacrifice()
            },
            effect: 'sacrifice {0} and fully heal itself',
            then: {
                gameAction: ability.actions.heal({ fully: true })
            }
        });
    }
}

ChuffApe.id = 'chuff-ape'; // This is a guess at what the id might be - please check it!!!

module.exports = ChuffApe;
