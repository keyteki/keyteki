const Card = require('../../Card.js');

class CooperativeHunting extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to a creature for each creature they control',
            gameAction: ability.actions.sequentialForEach(context => ({
                num: context.player.cardsInPlay.filter(card => card.type === 'creature').length,
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

CooperativeHunting.id = 'cooperative-hunting';

module.exports = CooperativeHunting;
