const DrawCard = require('../../drawcard.js');

class WayOfTheChrysanthemum extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain extra honor after bid',
            max: ability.limit.perRound(1),
            when: {
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.afterBid
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.gainHonor(context => ({ amount: context.event.amount }))
        });
    }
}

WayOfTheChrysanthemum.id = 'way-of-the-chrysanthemum';

module.exports = WayOfTheChrysanthemum;
