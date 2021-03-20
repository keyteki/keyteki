const Card = require('../../Card.js');

class YoungestBear extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                optional: true,
                cardCondition: (card, context) =>
                    card.exhausted === false && context.source.neighbors.includes(card),
                gameAction: ability.actions.reap()
            }
        });
    }
}

/*

class YoungestBear extends Card {


    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.exhausted === false,
                gameAction: ability.actions.reap()
            }
        });
    }

    
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card,context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.reap()
            }
        });
    }



    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.reap((context) => ({
                target: context.player.creaturesInPlay.filter((card) =>
                    this.neighbors.includes(card)
                )
            }))
        });
    }
    
}

*/

YoungestBear.id = 'youngest-bear';

module.exports = YoungestBear;
