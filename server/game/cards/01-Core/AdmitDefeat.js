const DrawCard = require('../../drawcard.js');

class AdmitDefeat extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.defenders.length === 1,
            target: {
                cardType: 'character',
                gameAction: 'bow',
                cardCondition: card => this.game.currentConflict.isDefending(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { bow: context.target });
            }
        });
    }
}

AdmitDefeat.id = 'admit-defeat';

module.exports = AdmitDefeat;
