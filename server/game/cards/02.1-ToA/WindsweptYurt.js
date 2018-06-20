const DrawCard = require('../../drawcard.js');

class WindsweptYurt extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 2 fate or 2 honor',
            target: {
                mode: 'select',
                choices: {
                    'Each player gains 2 fate': ability.actions.gainFate(context => ({
                        amount: 2,
                        target: context.game.getPlayers()
                    })),
                    'Each player gains 2 honor': ability.actions.gainFate(context => ({
                        amount: 2,
                        target: context.game.getPlayers()
                    }))
                }
            },
            cost: ability.costs.sacrificeSelf(),
            effect: 'give each player 2 {1}',
            effectArgs: context => context.select === 'Each player gains 2 fate' ? 'fate' : 'honor',
            then: context => ({
                handler: () => {
                    let card = context.player.getDynastyCardInProvince(context.cardStateWhenInitiated.location);
                    if(card) {
                        card.facedown = false;
                    }
                }
            })
        });
    }
}

WindsweptYurt.id = 'windswept-yurt';

module.exports = WindsweptYurt;
