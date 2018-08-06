const Card = require('../../Card.js');

class Dextre extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture()
        });

        this.destroyed({
            gameAction: ability.actions.moveCard(context => ({
                target: context.source,
                destination: 'deck'
            }))
        });
    }
}

Dextre.id = 'dextre'; // This is a guess at what the id might be - please check it!!!

module.exports = Dextre;
