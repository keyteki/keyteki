const Card = require('../../Card.js');

class MothershipSupport extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequentialForEach(context => ({
                forEach: context.player.cardsInPlay(card => card.type === 'creature' && card.hasHouse('mars') && !card.exhausted),
                action: ability.actions.dealDamage({
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
