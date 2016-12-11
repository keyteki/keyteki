const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class SeenInFlames extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card || player.phase !== 'challenge') {
            return false;
        }

        var rhllor = player.cardsInPlay.find(card => {
            return card.hasTrait('R\'hllor');
        });

        return !!rhllor;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return;
        }

        var buttons = otherPlayer.hand.map(card => {
            return { text: card.name, command: 'menuButton', method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
        });

        buttons.push({ text: 'Cancel', command: 'menuButton', method: 'cancel' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select a card to discard',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }
    
    cardSelected(player, cardId) {
        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return false;
        }

        var discarded = otherPlayer.discardFromHand(cardId);

        if(!discarded) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand', player, this, discarded, otherPlayer);
        
        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

SeenInFlames.code = '01064';

module.exports = SeenInFlames;
