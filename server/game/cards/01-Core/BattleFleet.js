const Card = require('../../Card.js');

class BattleFleet extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose which cards to reveal',
                mode: 'unlimited',
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => card.hasHouse('mars'),
                gameAction: ability.actions.draw((context) => ({
                    target: context.player,
                    amount: context.target.length
                }))
            },
            effect: 'reveal {0} from their hand, and draw {1} cards',
            effectArgs: (context) => (context.target.length ? context.target.length : 1)
        });
    }
}

BattleFleet.id = 'battle-fleet';

module.exports = BattleFleet;
