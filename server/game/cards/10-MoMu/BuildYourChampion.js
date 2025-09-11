const Card = require('../../Card.js');

class BuildYourChampion extends Card {
    // Play: Search your deck and discard pile for two halves of a
    // gigantic creature, reveal them, and archive them.
    setupCardAbilities(ability) {
        this.play({
            effect: 'search for two parts of a Gigantic creature part and archive them',
            gameAction: ability.actions.search({
                cardCondition: (card) => card.gigantic,
                amount: 2,
                destination: 'archives'
            })
        });
    }
}

BuildYourChampion.id = 'build-your-champion';

module.exports = BuildYourChampion;
