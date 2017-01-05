const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class AlerieTyrell extends DrawCard {
    play(player) {
        super.play(player);

        if(player.phase !== 'marshal') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Search top 10 cards', method: 'trigger' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    trigger(player) {
        var characters = player.searchDrawDeck(10, card => {
            return card.getType() === 'character' && card.getFaction() === 'tyrell' && card.getCost() <= 3;
        });

        var buttons = _.map(characters, card => {
            return { text: card.name, method: 'cardSelected', arg: card.uuid };
        });
        buttons.push({ text: 'Done', method: 'doneSelecting' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select a card to add to your hand',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }

    cardSelected(player, cardId) {
        var card = player.findCardByUuid(player.drawDeck, cardId);

        if(!card) {
            return false;
        }

        player.moveCard(card, 'hand');
        player.shuffleDrawDeck();

        this.game.addMessage('{0} uses {1} to search the top 10 cards of their deck and reveal {2} and add it to their hand', player, this, card);

        return true;
    }

    doneSelecting(player) {
        player.shuffleDrawDeck();

        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);

        return true;
    }    
}

AlerieTyrell.code = '05037';

module.exports = AlerieTyrell;
