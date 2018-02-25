const DrawCard = require('../../drawcard.js');

class Deathseeker extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove fate/discard character',
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.isAttacking(this)
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.controller !== context.player && 
                                                  (card.fate > 0 ? card.allowGameAction('removeFate', context) : card.allowGameAction('discardFromPlay', context))
            },
            handler: context => {
                if(context.target.fate === 0) {
                    this.game.addMessage('{0} sacrifices {1} to discard {2}', context.player, this, context.target);
                    this.game.applyGameAction(context, { discardFromPlay: context.target });
                } else {
                    this.game.addMessage('{0} sacrifices {1} to remove 1 fate from {2}', context.player, this, context.target);
                    this.game.applyGameAction(context, { removeFate: context.target });                 
                }
            }
        });
    }
}

Deathseeker.id = 'deathseeker';

module.exports = Deathseeker;
