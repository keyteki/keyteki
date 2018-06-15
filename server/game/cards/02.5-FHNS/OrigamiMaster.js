const DrawCard = require('../../drawcard.js');

class OrigamiMaster extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move an honor token',
            condition: () => this.isHonored,
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.location === 'play area' && card.controller === this.controller && !card.isHonored &&
                                                  (card.isDishonored || card.allowGameAction('becomeHonored', context))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to move an honor token to {2}', this.controller, this, context.target);
                this.isHonored = false;
                if(context.target.isDishonored) {
                    context.target.isDishonored = false;
                } else {
                    context.target.isHonored = true;
                }
            }
        });
    }
}

OrigamiMaster.id = 'origami-master';

module.exports = OrigamiMaster;
