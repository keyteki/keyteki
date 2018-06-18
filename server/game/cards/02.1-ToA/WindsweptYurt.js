const DrawCard = require('../../drawcard.js');

class WindsweptYurt extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 2 fate or 2 honor',
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Each player gains 2 fate': () => true,
                    'Each player gains 2 honor': () => true
                }
            },
            cost: ability.costs.sacrificeSelf(),
            effect: 'give each player 2 {1}',
            effectArgs: context => context.select === 'Each player gains 2 fate' ? 'fate' : 'honor',
            handler: context => {
                if(context.select === 'Each player gains 2 fate') {
                    ability.actions.gainFate({ amount: 2 }).resolve(this.game.getPlayers(), context);
                } else {
                    ability.actions.gainHonor({ amount: 2 }).resolve(this.game.getPlayers(), context);
                }
                let card = this.controller.getDynastyCardInProvince(context.cardStateWhenInitiated.location);
                if(card) {
                    card.facedown = false;
                }
            }
        });
    }
}

WindsweptYurt.id = 'windswept-yurt';

module.exports = WindsweptYurt;
