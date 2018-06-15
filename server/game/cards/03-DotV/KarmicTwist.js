const DrawCard = require('../../drawcard.js');

class KarmicTwist extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Move fate from a non-unique character',
            condition: () =>
                this.controller.cardsInPlay.any(card => !card.isUnique() && card.getFate() === 0 && card.allowGameAction('placeFate')) &&
                this.controller.cardsInPlay.any(card => !card.isUnique() && card.allowGameAction('removeFate')) || 
                this.controller.opponent &&
                this.controller.opponent.cardsInPlay.some(card => !card.isUnique() && card.getFate() === 0 && card.allowGameAction('placeFate')) &&
                this.controller.opponent.cardsInPlay.some(card => !card.isUnique() && card.allowGameAction('removeFate')),
            target: {
                activePromptTitle: 'Choose a donor character',
                cardType: 'character',
                gameAction: 'removeFate',
                cardCondition: card => !card.isUnique()
            },
            handler: context => this.game.promptForSelect(this.controller, {
                activePromptTitle: 'Choose a recipient character',
                cardType: 'character',
                source: this,
                cardCondition: card => 
                    !card.isUnique() && 
                    card.getFate() === 0 && 
                    card.controller === context.target.controller && 
                    card.allowGameAction('placeFate', context),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1} to move {2} fate from {3} to {4}', player, this, context.target.fate, context.target, card);
                    let event = this.game.applyGameAction(context, { removeFate: context.target })[0];
                    event.fate = context.target.getFate();
                    event.recipient = card;
                    return true;
                }
            })
        });
    }
}

KarmicTwist.id = 'karmic-twist'; // This is a guess at what the id might be - please check it!!!

module.exports = KarmicTwist;
