const Card = require('../../Card.js');

class BrainDrain extends Card {
    // Play: Look at your opponent's hand. Choose a card from it and put it on top of their deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                controller: 'opponent',
                revealTargets: true,
                location: 'hand',
                gameAction: ability.actions.returnToDeck({
                    reveal: true
                })
            }
        });
    }
}

BrainDrain.id = 'brain-drain';

module.exports = BrainDrain;
