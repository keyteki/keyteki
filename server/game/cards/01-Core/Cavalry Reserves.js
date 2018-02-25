const DrawCard = require('../../drawcard.js');

class CavalryReserves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put Cavalry into play from your discard',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                mode: 'maxStat',
                activePromptTitle: 'Choose characters',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                numCards: 0,
                multiSelect: true,
                cardType: 'character',
                gameAction: 'putIntoConflict',
                cardCondition: card => card.hasTrait('cavalry') && card.location === 'dynasty discard pile' && card.controller === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, putting {2} into the conflict', this.controller, this, context.target);
                this.game.applyGameAction(context, { putIntoConflict: context.target });
            }
        });
    }
}

CavalryReserves.id = 'cavalry-reserves';

module.exports = CavalryReserves;
