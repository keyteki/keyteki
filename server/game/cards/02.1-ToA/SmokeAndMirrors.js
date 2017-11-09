const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class SmokeAndMirrors extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move shinobi home',
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose characters',
                numCards: 0,
                multiSelect: true,
                cardType: 'character',
                cardCondition: card => {
                    return (card.controller === this.controller && card.isAttacking() && card.hasTrait('shinobi'));
                }
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.currentConflict.sendHome(context.target);
            }
        });
    }
}

SmokeAndMirrors.id = 'smoke-and-mirrors';

module.exports = SmokeAndMirrors;
