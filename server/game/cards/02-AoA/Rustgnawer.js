const Card = require('../../Card.js');

class Rustgnawer extends Card {
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            },
            then: context => ({
                gameAction: [
                    ability.actions.gainAmber({ amount: !context.target.printedAmber ? 0 : context.target.printedAmber })
                ]
            })
        });
    }
}

Rustgnawer.id = 'rustgnawer';

module.exports = Rustgnawer;
