const Card = require('../../Card.js');

class Glimmerspore extends Card {
    // Play: Put an artifact from play into your archives. If you are
    // not the owner of that card and it leaves your archives, put it
    // into its owner’s hand instead.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                controller: 'any',
                gameAction: [
                    ability.actions.archive((context) => ({
                        target: context.target?.owner === context.player ? context.target : []
                    })),
                    ability.actions.abduct((context) => ({
                        target: context.target?.owner !== context.player ? context.target : []
                    }))
                ]
            }
        });
    }
}

Glimmerspore.id = 'glimmerspore';

module.exports = Glimmerspore;
