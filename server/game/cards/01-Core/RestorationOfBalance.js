const ProvinceCard = require('../../provincecard.js');

class RestorationOfBalance extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard to 4 cards',
            when: {
                onProvinceRevealed: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.chosenDiscard(context => ({
                amount: Math.max(0, context.player.opponent.hand.size() - 4)
            }))
        });
    }
}

RestorationOfBalance.id = 'restoration-of-balance';

module.exports = RestorationOfBalance;
