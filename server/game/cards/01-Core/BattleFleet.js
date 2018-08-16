const Card = require('../../Card.js');

class BattleFleet extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'unlimited',
                controller: 'self',
                location: 'hand',
                cardCondition: card => card.hasHouse('mars'),
                gameAction: [
                    ability.actions.reveal(),
                    ability.actions.draw(context => ({
                        target: context.player,
                        amount: context.target.length
                    }))
                ]
            },
            effect: 'reveal Mars cards from their hand, and draw that many cards'
        });
    }
}

BattleFleet.id = 'battle-fleet'; // This is a guess at what the id might be - please check it!!!

module.exports = BattleFleet;
