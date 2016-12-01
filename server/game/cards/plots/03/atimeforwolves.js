const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class ATimeForWolves extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var direwolfCards = player.searchDrawDeck(10, card => {
            return card.hasTrait('Direwolf');
        });

        var buttons = _.map(direwolfCards, card => {
            return { text: card.name, command: 'menuButton', method: 'cardSelected', arg: card.uuid };
        });

        buttons.push({ text: 'Done', command: 'menuButton', method: 'doneSelecting' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select a card to add to your hand',
                buttons: buttons
            },

            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return false;
    }

    cardSelected(player, cardId) {
        if(this.owner !== player) {
            return;
        }

        var card = player.findCardByUuid(player.drawDeck, cardId);

        if(!card) {
            return;
        }

        player.moveFromDrawDeckToHand(card);
        player.shuffleDrawDeck();

        if(card.getCost() > 3) {
            this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);

            this.game.playerRevealDone(player);

            return;
        }

        this.revealedCard = card;

        var buttons = [
            { text: 'Keep in hand', command: 'plot', method: 'keepInHand' },
            { text: 'Put in play', command: 'plot', method: 'putInPlay' }
        ];
        
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Put card into play?',
                buttons: buttons
            },

            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    keepInHand(player) {
        if(this.owner !== player || !this.revealedCard) {
            return;
        }

        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, this.revealedCard);

        this.game.playerRevealDone(player);
    }

    putInPlay(player) {
        if(this.owner !== player || !this.revealedCard) {
            return;
        }

        this.game.addMessage('{0} uses {1} to reveal {2} and put it in play', player, this, this.revealedCard);

        player.playCard(this.revealedCard.uuid, true, player.hand);

        this.game.playerRevealDone(player);
    }

    doneSelecting(player) {
        if(this.owner !== player) {
            return;
        }
        
        this.game.playerRevealDone(player);
    }
}

ATimeForWolves.code = '03046';

module.exports = ATimeForWolves;
