const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class MiyaSatoshi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard dynasty cards until you find an Imperial',
            condition: () => this.controller.dynastyDeck.size() > 0,
            handler: () => {
                let firstImperial = this.controller.dynastyDeck.find(card => card.hasTrait('imperial'));
                if(!firstImperial) {
                    this.game.addMessage('{0} uses {1} and discards their entire dynasty deck: {2}', this.controller, this, this.controller.dynastyDeck.toArray());
                    this.controller.dynastyDeck.each(card => this.controller.moveCard(card, 'dynasty discard pile'));
                    return;
                }
                let index = this.controller.dynastyDeck.indexOf(firstImperial);
                let discardedCards = this.controller.dynastyDeck.first(index + 1);
                this.game.addMessage('{0} uses {1}, discarding {2}', this.controller, this, discardedCards);
                _.each(discardedCards, card => this.controller.moveCard(card, 'dynasty discard pile'));
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Choose a card to discard',
                    source: this,
                    cardCondition: card => ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) &&
                                           card.controller === this.controller && !card.isProvince,
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} chooses to discard {1}, and puts {2} faceup in its place', player, card, firstImperial);
                        this.controller.moveCard(firstImperial, card.location);
                        firstImperial.facedown = false;
                        this.controller.moveCard(card, 'dynasty discard pile');
                        return true;
                    }
                });
            }
        });
    }
}

MiyaSatoshi.id = 'miya-satoshi'; // This is a guess at what the id might be - please check it!!!

module.exports = MiyaSatoshi;
