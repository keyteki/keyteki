const Card = require('../../Card.js');

class SackOfCoins extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to a creature for each amber in their pool',
            gameAction: ability.actions.sequentialForEach(context => ({
                num: context.player.amber || 0,
                action: ability.actions.dealDamage({
                    amount: 1,
                    noGameStateCheck: true,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to deal 1 damage to',
                        cardType: 'creature'
                    }
                })
            }))
        });
    }
}

SackOfCoins.id = 'sack-of-coins';

module.exports = SackOfCoins;
