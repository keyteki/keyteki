const Card = require('../../Card.js');

class InvigoratingShower extends Card {
    // Play: Choose a house. Shuffle each card of that house from your
    // discard pile into your deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.returnToDeck((context) => ({
                target: context.player.discard.filter((card) => card.hasHouse(context.house)),
                shuffle: true
            }))
        });
    }
}

InvigoratingShower.id = 'invigorating-shower';

module.exports = InvigoratingShower;
