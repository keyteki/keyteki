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
                if(context.target === 'Each player gains 2 fate') {
                    this.game.addMessage('{0} uses {1} to give each player 2 fate', this.controller, this);
                    this.game.addFate(this.controller, 2);
                    this.game.addFate(this.controller.opponent, 2);
                } else {
                    this.game.addMessage('{0} uses {1} to give each player 2 honor', this.controller, this);
                    this.game.addHonor(this.controller, 2);
                    this.game.addHonor(this.controller.opponent, 2);
                }
                let province = this.controller.getSourceList(this.previousLocation);
                let card = province.find(card => card.isDynasty);
                card.facedown = false;
            }
        });
    }

    /**
        This sets the location to be used within the handler.  We don't have a good way to save the card's
        state while the costs are being paid.  This method gets called at selection time, so is as close
        as we're going to get
    **/
    canTriggerAbilities(location) {
        this.previousLocation = this.location;
        return super.canTriggerAbilities(location);
    }
}

WindsweptYurt.id = 'windswept-yurt';

module.exports = WindsweptYurt;
