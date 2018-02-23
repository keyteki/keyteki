const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class Outwit extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send a character home.',
            condition: () => this.controller.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            target: {
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.controller !== this.controller && card.getPoliticalSkill() < _.max(this.controller.cardsInPlay.map(card => {
                    if(card.hasTrait('courtier') && card.isParticipating()) {
                        return card.getPoliticalSkill();
                    }
                    return 0;
                }))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.applyGameAction(context, { sendHome: context.target });
            }
        });
    }
}

Outwit.id = 'outwit';

module.exports = Outwit;
