const Card = require('../../Card.js');

class PublicTheft extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.enrage()
            },
            effect: 'enrage {1} and move all amber from it to their pool',
            then: {
                gameAction: ability.actions.removeAmber(),
                then: {
                    gameAction: ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvent.amount
                    }))
                }
            }
        });
    }
}

PublicTheft.id = 'public-theft';

module.exports = PublicTheft;
