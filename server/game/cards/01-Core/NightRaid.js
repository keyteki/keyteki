const ProvinceCard = require('../../provincecard.js');

class NightRaid extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Force opponent to discard cards equal to the number of attackers',
            when: {
                onProvinceRevealed: event => event.province === this && this.controller.opponent.hand.size() > 0
            },
            handler: context => {
                let num = Math.min(context.event.conflict.attackers.length, this.controller.opponent.hand.size());
                this.game.addMessage('{0} uses {1} to force {2} to discard {3} cards', this.controller, this, this.controller.opponent, num);
                if(num === this.controller.opponent.hand.size()) {
                    let cards = this.controller.opponent.hand.flatten();
                    this.controller.opponent.discardCardsFromHand(cards);
                } else {
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
            }
        });
    }
}

NightRaid.id = 'night-raid';

module.exports = NightRaid;
