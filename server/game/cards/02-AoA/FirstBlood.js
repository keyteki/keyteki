const Card = require('../../Card.js');

class FirstBlood extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to a creature for each friendly brobnar creature',
            gameAction: ability.actions.sequentialForEach(context => ({
                num: context.player.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('brobnar')).length,
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

FirstBlood.id = 'first-blood';

module.exports = FirstBlood;
