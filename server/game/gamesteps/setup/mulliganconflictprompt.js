const _ = require('underscore');
const MulliganDynastyPrompt = require('./mulligandynastyprompt.js');

class MulliganConflictPrompt extends MulliganDynastyPrompt {
    completionCondition(player) {
        return player.takenConflictMulligan;
    }

    activePrompt() {
        return Object.assign(super.activePrompt(), {
            menuTitle: 'Select conflict cards to mulligan',
            promptTitle: 'Conflict Mulligan'
        });
    }

    highlightSelectableCards() {
        _.each(this.game.getPlayers(), player => {
            if(!this.selectableCards[player.name]) {
                this.selectableCards[player.name] = player.hand.toArray();
            }
            player.setSelectableCards(this.selectableCards[player.name]);
        });
    }

    cardCondition(card) {
        return card.location === 'hand';
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to mulligan conflict cards' };
    }

    menuCommand(player, arg) {
        if(arg === 'done') {
            if(this.selectedCards[player.name].length > 0) {
                for(const card of this.selectedCards[player.name]) {
                    player.moveCard(card, 'conflict deck bottom');
                }
                player.drawCardsToHand(this.selectedCards[player.name].length);
                player.shuffleConflictDeck();
                this.game.addMessage('{0} has mulliganed {1} cards from the conflict deck', player, this.selectedCards[player.name].length);
            } else {
                this.game.addMessage('{0} has kept all conflict cards', player);
            }
            _.each(['province 1', 'province 2', 'province 3', 'province 4'], location => {
                let card = player.getDynastyCardInProvince(location);
                if(card) {
                    card.facedown = true;
                }
            });
            player.clearSelectedCards();
            player.clearSelectableCards();
            player.takenConflictMulligan = true;
            this.readyToStart = true;
            return true;
        }
        return false;
    }
}

module.exports = MulliganConflictPrompt;
