const Card = require('../../Card.js');

class CooperativeHunting extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to a creature for each creature they control',
            gameAction: ability.actions.sequentialForEach(context => ({
                forEach: context.player.cardsInPlay.filter(card => card.type === 'creature'),
                action: ability.actions.dealDamage({
                    amount: 1,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to deal 1 damage to',
                        cardType: 'creature'
                    }
                })
            }))

        });
    }
}

CooperativeHunting.id = 'cooperative-hunting'; // This is a guess at what the id might be - please check it!!!

module.exports = CooperativeHunting;
