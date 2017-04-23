const PlotCard = require('../../../plotcard.js');

class ATimeForWolves extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card to add to your hand',
                    cardCondition: card => card.hasTrait('Direwolf'),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');

        if(card.getCost() > 3) {
            this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);
            return;
        }

        this.revealedCard = card;

        var buttons = [
            { text: 'Keep in hand', method: 'keepInHand' },
            { text: 'Put in play', method: 'putInPlay' }
        ];

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Put card into play?',
                buttons: buttons
            },

            source: this
        });
    }

    keepInHand(player) {
        if(!this.revealedCard) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, this.revealedCard);
        this.revealedCard = null;

        return true;
    }

    putInPlay(player) {
        if(!this.revealedCard) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to reveal {2} and put it in play', player, this, this.revealedCard);
        player.putIntoPlay(this.revealedCard);
        this.revealedCard = null;

        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to find a card', player, this);
    }
}

ATimeForWolves.code = '03046';

module.exports = ATimeForWolves;
