const DrawCard = require('../../../drawcard.js');

class HisViperEyes extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(!this.game.currentChallenge || this.game.currentChallenge.winner === this.controller ||
                (this.game.currentChallenge.challengeType !== 'military' && this.game.currentChallenge.challengeType !== 'power')) {
            return false;
        }

        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return;
        }

        this.game.promptWithMenu(otherPlayer, this, {
            activePrompt: {
                menuTitle: 'Resolve ' + this.name + ' and reveal hand to opponent?',
                buttons: [
                    { text: 'Yes', method: 'revealHand' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            source: this
        });
    }

    revealHand() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        var buttons = otherPlayer.hand.map(card => {
            return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
        });

        buttons.push({ text: 'Cancel', method: 'cancel' });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select a card to discard',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    cardSelected(player, cardId) {
        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return false;
        }

        var card = otherPlayer.findCardByUuid(otherPlayer.hand, cardId);
        if(!card) {
            return false;
        }

        otherPlayer.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand', player, this, card, otherPlayer);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

HisViperEyes.code = '03032';

module.exports = HisViperEyes;
