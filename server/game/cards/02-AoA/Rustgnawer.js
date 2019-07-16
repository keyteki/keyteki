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
                    ability.actions.gainAmber(() => context.target.printedAmber)
                ]
            })
        });
    }
}

Rustgnawer.id = 'rustgnawer';

module.exports = Rustgnawer;
