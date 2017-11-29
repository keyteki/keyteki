const ProvinceCard = require('../../provincecard.js');

class FeastOrFamine extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Move fate from an opposing character',
            when: {
                onBreakProvince: event => event.province === this && this.controller.cardsInPlay.any(card => card.fate === 0)
            },
            target: {
                cardType: 'character',
                gameAction: 'removeFate',
                cardCondition: card => card.controller !== this.controller && card.location === 'play area' && card.fate > 0
            },
            handler: context => this.game.promptForSelect(this.controller, {
                activePromptTitle: 'Choose a character',
                source: this,
                cardType: 'character',
                cardCondition: card => card.controller === this.controller && card.location === 'play area' && card.fate === 0,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1} to move {2} fate from {3} to {4}', player, this, context.target.fate, context.target, card);
                    this.game.raiseEvent('onCardRemoveFate', { card: context.target, fate: context.target.fate, recipient: card });
                    return true;
                }
            })
        });
    }
}

FeastOrFamine.id = 'feast-or-famine';

module.exports = FeastOrFamine;
