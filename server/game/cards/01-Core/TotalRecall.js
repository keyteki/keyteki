const Card = require('../../Card.js');

class TotalRecall extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain {1} amber and return all of their creatures to their hand',
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    amount: context.player.creaturesInPlay.filter((card) => !card.exhausted).length
                })),
                ability.actions.returnToHand((context) => ({
                    target: context.player.creaturesInPlay
                }))
            ]
        });
    }
}

TotalRecall.id = 'total-recall';

module.exports = TotalRecall;
