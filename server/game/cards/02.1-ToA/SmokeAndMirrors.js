const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class SmokeAndMirrors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move shinobi home',
            condition: () => {
                return (this.game.currentConflict && this.controller.anyCardsInPlay(card => card.controller === this.controller && card.isAttacking() && card.hasTrait('shinobi')));
            },
            target: {
                activePromptTitle: 'Choose shinobi',
                numCards: 0,
                multiSelect: true,
                cardType: 'character',
                cardCondition: card => {
                    return (card.controller === this.controller && card.isAttacking() && card.hasTrait('shinobi'));
                }
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                _.each(context.target, card => this.game.currentConflict.sendHome(card));
            }
        });
    }
}

SmokeAndMirrors.id = 'smoke-and-mirrors';

module.exports = SmokeAndMirrors;
