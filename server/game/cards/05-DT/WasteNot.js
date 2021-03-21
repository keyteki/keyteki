const Card = require('../../Card.js');

class WasteNot extends Card {
    //Play: Destroy a friendly creature. Draw cards equal to half its power rounded up.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: (context) => ({
                gameAction: ability.actions.draw({ amount: Math.ceil(context.target.power * 0.5) })
            })
        });
    }
}

WasteNot.id = 'waste-not';

module.exports = WasteNot;
