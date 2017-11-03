const DrawCard = require('../../drawcard.js');

class DaidojiNerishma extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Flip a card faceup',
            target: {
                cardCondition: card => card.isDynasty && card.facedown && ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to flip {2} faceup', this.controller, this, context.target);
                context.target.facedown = false;
            }
        });
    }
}

DaidojiNerishma.id = 'daidoji-nerishma';

module.exports = DaidojiNerishma;
