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
            source: this
        });

        return true;
    }

    typeSelected(player, type) {
        this.game.promptForDeckSearch(this.controller, {
            activePromptTitle: 'Select a card add to your hand',
            cardCondition: card => card.getType() !== type,
            onSelect: (player, card) => this.cardSelected(player, card),
            onCancel: player => this.doneSelecting(player),
            source: this
        });

        return true;
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);
    }
}

OlennasCunning.code = '01196';

module.exports = OlennasCunning;
