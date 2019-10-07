const Card = require('../../Card.js');

class Mug extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a captured amber to move to your pool.',
                cardType: 'creature',
                gameAction: [
                    ability.actions.returnAmber(context => ({ amount: 1, recipient: context.player })),
                    ability.actions.dealDamage({ amount: 2 })
                ]
            },
            effect: 'move 1 amber from {0} to their pool and deal 2 damages to it'
        });
    }
}

Mug.id = 'mug';

module.exports = Mug;
