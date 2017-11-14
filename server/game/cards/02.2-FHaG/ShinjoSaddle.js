const DrawCard = require('../../drawcard.js');

class ShinjoSaddle extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move to another character',
            target: {
                cardType: 'character',
                cardCondition: card => card.controller === this.controller & card.location === 'play area' && card.hasTrait('cavalry') && this.controller.canAttach(this, card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to attach {1} to {2}', this.controller, this, context.target);
                this.controller.attach(this, context.target);
            }
        });
    }

    canAttach(card) {
        if(card.controller !== this.controller || !card.hasTrait('cavalry')) {
            return false;
        }
        return super.canAttach(card);
    }
}

ShinjoSaddle.id = 'shinjo-saddle';

module.exports = ShinjoSaddle;
