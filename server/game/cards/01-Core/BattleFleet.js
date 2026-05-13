const Card = require('../../Card.js');

class BattleFleet extends Card {
    // Play: Reveal any number of Mars cards from your hand. For each card revealed this way, draw 1 card.
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
            effect: '{1}',
            effectArgs: (context) => {
                const n = context.target.length;
                return n
                    ? `reveal ${n} Mars card${
                          n === 1 ? '' : 's'
                      } from their hand, and draw ${n} card${n === 1 ? '' : 's'}`
                    : 'reveal no Mars cards from their hand';
            }
        });
    }
}

BattleFleet.id = 'battle-fleet';

module.exports = BattleFleet;
