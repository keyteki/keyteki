const Card = require('../../Card.js');

class MobiusScroll extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                controller: 'self',
                location: 'hand',
                mode: 'upTo',
                numCards: 2,
                gameAction: [
                    ability.actions.archive(context => ({
                        target: context.target
                    })),
                    ability.actions.archive({ owner: true })
                ]
            }
        });
    }
}

MobiusScroll.id = 'mobius-scroll'; // This is a guess at what the id might be - please check it!!!

module.exports = MobiusScroll;
