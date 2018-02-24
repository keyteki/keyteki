const DrawCard = require('../../drawcard.js');

class FallenInBattle extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Discard a character',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.conflictType === 'military' && event.conflict.skillDifference > 4
            },
            max: ability.limit.perConflict(1),
            target: {
                cardType: 'character',
                gameAction: 'discardFromPlay',
                cardCondition: card => this.game.currentConflict.isParticipating(card)
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to discard {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { discardFromPlay: context.target });
            }
        });
    }
}

FallenInBattle.id = 'fallen-in-battle';

module.exports = FallenInBattle;
