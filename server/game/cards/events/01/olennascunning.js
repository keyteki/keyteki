const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class OlennasCunning extends DrawCard {
    canPlay(player, card) {
        if(this !== card || !this.game.currentChallenge || (this.game.currentChallenge.challengeType !== 'intrigue' && this.game.currentChallenge.challengeType !== 'power')) {
            return false;
        }

        if(this.game.currentChallenge.winner !== this.controller) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play() {
        var buttons = [
            { text: 'Character', method: 'typeSelected', arg: 'character' },
            { text: 'Location', method: 'typeSelected', arg: 'location' },
            { text: 'Attachment', method: 'typeSelected', arg: 'attachment' },
            { text: 'Event', method: 'typeSelected', arg: 'event' }
        ];

        this.game.promptWithMenu(this.game.currentChallenge.loser, this, {
            activePrompt: {
                menuTitle: 'Select a card type',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    typeSelected(player, type) {
        var cards = this.controller.searchDrawDeck(card => {
            return card.getType() !== type;
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

        return true;
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

OlennasCunning.code = '01196';

module.exports = OlennasCunning;
