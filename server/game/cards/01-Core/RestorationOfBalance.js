const ProvinceCard = require('../../provincecard.js');

class RestorationOfBalance extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Force opponent to discard to 4 cards',
            when: {
                onProvinceRevealed: event => event.province === this && this.controller.opponent.hand.size() > 4
            },
            handler: () => {
                let num = this.controller.opponent.hand.size() - 4;
                this.game.addMessage('{0} uses {1} to force {2} to discard {3} cards', this.controller, this, this.controller.opponent, num);
                let promptTitle = 'Choose ' + num.toString() + ' cards to discard';
                if(num === 1) {
                    promptTitle = 'Choose a card to discard';
                }
                this.game.promptForSelect(this.controller.opponent, {
                    activePromptTitle: promptTitle,
                    source: this,
                    cardCondition: card => card.location === 'hand',
                    numCards: num,
                    mode: 'exactly',
                    multiSelect: true,
                    onSelect: (player, card) => {
                        player.discardCardsFromHand(card);
                        return true;
                    }
                });
            }
        });
    }
}

RestorationOfBalance.id = 'restoration-of-balance';

module.exports = RestorationOfBalance;
