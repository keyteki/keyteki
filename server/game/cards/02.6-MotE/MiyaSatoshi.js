const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class MiyaSatoshi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard dynasty cards until you find an Imperial',
            condition: context => context.player.dynastyDeck.size() > 0,
            effect: 'search for an Imperial card and place it in a province',
            handler: context => {
                let firstImperial = context.player.dynastyDeck.find(card => card.hasTrait('imperial'));
                if(!firstImperial) {
                    this.game.addMessage('{0} discards their entire dynasty deck: {1}', context.player, context.player.dynastyDeck.toArray());
                    context.player.dynastyDeck.each(card => context.player.moveCard(card, 'dynasty discard pile'));
                    return;
                }
                let index = context.player.dynastyDeck.indexOf(firstImperial);
                let discardedCards = context.player.dynastyDeck.first(index + 1);
                this.game.addMessage('{0} discards {1} while searching for an Imperial card', context.player, discardedCards);
                _.each(discardedCards, card => context.player.moveCard(card, 'dynasty discard pile'));
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose a card to discard',
                    context: context,
                    location: 'province',
                    controller: 'self',
                    cardCondition: card => card.isDynasty,
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} chooses to discard {1}, and puts {2} faceup in its place', player, card, firstImperial);
                        context.player.moveCard(firstImperial, card.location);
                        firstImperial.facedown = false;
                        context.player.moveCard(card, 'dynasty discard pile');
                        return true;
                    }
                });
            }
        });
    }
}

MiyaSatoshi.id = 'miya-satoshi';

module.exports = MiyaSatoshi;
