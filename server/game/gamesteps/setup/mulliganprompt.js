const _ = require('underscore');
const AllPlayerPrompt = require('../allplayerprompt.js');

class MulliganPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.takenMulligan = {};
    }

    completionCondition(player) {
        return this.takenMulligan[player.uuid];
    }

    activePrompt() {
        return {
            menuTitle: 'Do you wish to mulligan your hand?',
            buttons: [
                { text: 'Yes', arg: 'yes' },
                { text: 'No', arg: 'no' }
            ],
            promptTitle: 'Mulligan'
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to mulligan cards'
        };
    }

    menuCommand(player, arg) {
        if(this.takenMulligan[player.uuid]) {
            return false;
        }
        if(arg === 'yes') {
            let size = player.hand.length;
            for(let card of player.hand) {
                player.moveCard(card, 'deck');
            }
            player.shuffleDeck();
            player.drawCardsToHand(size - 1);
            this.takenMulligan[player.uuid] = true;
            return true;
        } else if(arg === 'no') {
            this.takenMulligan[player.uuid] = true;
            return true;
        }
        return false;
    }
}

module.exports = MulliganPrompt;
