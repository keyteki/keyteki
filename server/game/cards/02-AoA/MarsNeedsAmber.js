const Card = require('../../Card.js');

class MarsNeedsAmber extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            effect: 'make each damaged enemy non-mars creature capture 1 amber from their side',
            gameAction: ability.actions.capture(context => {
                let damagedNonMarsCreatures = context.player.opponent.creaturesInPlay.filter(card => card.hasToken('damage') && !card.hasHouse('mars'));
                if(!context.player.opponent || context.player.opponent.amber === 0) {
                    return { target: [] };
                } else if(context.player.opponent.amber >= damagedNonMarsCreatures.length) {
                    return {
                        target: damagedNonMarsCreatures,
                        ownController: true
                    };
                }

                return {
                    promptForSelect: {
                        cardCondition: card => damagedNonMarsCreatures.includes(card),
                        mode: 'exactly',
                        numCards: context.player.opponent.amber
                    },
                    ownController: true
                };
            })
        });
    }
}

MarsNeedsAmber.id = 'mars-needs-æmber';

module.exports = MarsNeedsAmber;
