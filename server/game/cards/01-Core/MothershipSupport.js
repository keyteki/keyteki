const Card = require('../../Card.js');

class MothershipSupport extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to a creature for each ready Mars creature they control',
            gameAction: ability.actions.sequentialForEach(context => ({
                num: context.player.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('mars') && !card.exhausted).length,
                action: ability.actions.dealDamage({
                    noGameStateCheck: true,
                    amount: 2,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to deal 2 damage to',
                        cardType: 'creature'
                    }
                })
            }))
        });
    }
}

MothershipSupport.id = 'mothership-support'; // This is a guess at what the id might be - please check it!!!

module.exports = MothershipSupport;
