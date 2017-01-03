const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheReader extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onUnopposedWin', 'onPhaseEnded']);
    }

    onPhaseEnded() {
        this.abilityUsed = false;
    }

    onUnopposedWin(event, challenge) {
        var winner = challenge.winner;
        if(this.isBlank() || this.controller !== winner || this.abilityUsed) {
            return;
        }

        var cards = challenge.getWinnerCards();

        if(!_.any(cards, card => {
            return card.getFaction() === 'greyjoy' && card.isUnique();
        })) {
            return;
        }

        this.game.promptWithMenu(winner, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Draw 1 card', method: 'drawCard' },
                    { text: 'Discard 3 cards', method: 'discardCards' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to perform reactions'
        });
    }

    discardCards(player) {
        var otherPlayer = this.game.getOtherPlayer(player);

        if(!otherPlayer) {
            return true;
        }

        otherPlayer.discardFromDraw(3);

        this.game.addMessage('{0} uses {1} to discard the top 3 cards from {2}\'s deck', player, this, otherPlayer);

        this.abilityUsed = true;

        return true;
    }

    drawCard(player) {
        player.drawCardsToHand(1);

        this.game.addMessage('{0} uses {1} to draw 1 card', player, this);

        this.abilityUsed = true;

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

TheReader.code = '02031';

module.exports = TheReader;
