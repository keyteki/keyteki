const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class Rout extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send a character home.',
            condition: () => this.controller.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('bushi')),
            target: {
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.isParticipating() && card.controller !== this.controller && card.getMilitarySkill() < _.max(this.controller.cardsInPlay.map(card => {
                    if(card.hasTrait('bushi') && card.isParticipating()) {
                        return card.getMilitarySkill();
                    }
                    return 0;
                }))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.currentConflict.sendHome(context.target);
            }
        });
    }
}

Rout.id = 'rout';

module.exports = Rout;
