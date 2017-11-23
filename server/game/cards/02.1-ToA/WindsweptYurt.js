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
            source: this,
            handler: context => {
                if(context.select === 'Each player gains 2 fate') {
                    this.game.addMessage('{0} uses {1} to give each player 2 fate', this.controller, this);
                    this.game.addFate(this.controller, 2);
                    if(this.controller.opponent) {
                        this.game.addFate(this.controller.opponent, 2);
                    }
                } else {
                    this.game.addMessage('{0} uses {1} to give each player 2 honor', this.controller, this);
                    this.game.addHonor(this.controller, 2);
                    if(this.controller.opponent) {
                        this.game.addHonor(this.controller.opponent, 2);
                    }
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
