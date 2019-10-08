const Card = require('../../Card.js');

class BabblingBibliophile extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw({
                amount: 2
            })
        });
    }
}

BabblingBibliophile.id = 'babbling-bibliophile';
module.exports = BabblingBibliophile;
