const Card = require('../../Card.js');

class FirstBlood extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequentialForEach(context => ({
                num: (context.player.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('brobnar')).length) * 2,
                action: ability.actions.dealDamage({
                    noGameStateCheck: true,
                    amount: 1,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to deal 1 damage to',
                        cardType: 'creature'
                    }
                })
            })),
            effect: 'deal 2 damage for each friendly brobnar creature, totalling {1}.',
            effectArgs: context => (context.player.cardsInPlay.filter(card => card.type === 'creature' && card.hasHouse('brobnar')).length) * 2
        });
    }
}

FirstBlood.id = 'first-blood';

module.exports = FirstBlood;
