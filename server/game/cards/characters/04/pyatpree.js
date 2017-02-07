const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class PyatPree extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isParticipating(this)
            },
            handler: () => {
                var cards = this.controller.searchDrawDeck(this.game.currentChallenge.strengthDifference, card => {
                    return (card.getType() === 'attachment' || card.getType() === 'event') && card.getFaction() === 'targaryen';
                });

                var buttons = _.map(cards, card => {
                    return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
                });
                buttons.push({ text: 'Done', method: 'doneSelecting' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card add to your hand',
                        buttons: buttons
                    },
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name
                });
            }
        });
    }

    cardSelected(player, cardId) {
        var card = player.findCardByUuid(player.drawDeck, cardId);

        if(!card) {
            return false;
        }

        player.moveCard(card, 'hand');
        player.shuffleDrawDeck();

        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);

        return true;
    }

    doneSelecting(player) {
        player.shuffleDrawDeck();

        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);

        return true;
    }
}

PyatPree.code = '04073';

module.exports = PyatPree;
