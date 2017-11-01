const _ = require('underscore');

const AllPlayerPrompt = require('./allplayerprompt.js');

class HonorBidPrompt extends AllPlayerPrompt {
    constructor(game, menuTitle) {
        super(game);
        this.menuTitle = menuTitle || 'Choose a bid';
        _.each(game.getPlayers(), player => {
            player.honorBid = 0;
            player.showBid = 0;
        });
    }
    
    activeCondition(player) {
        return player.honorBid === 0;
    }
    
    completionCondition(player) {
        return player.honorBid > 0;
    }
    
    continue() {
        let completed = super.continue();
        
        if(completed) {
            _.each(this.game.getPlayers(), player => player.setShowBid());
            this.game.raiseEvent('onHonorDialsRevealed');
        }
        
        return completed;
    }

    activePrompt() {
        return {
            promptTitle: 'Honor Bid',
            menuTitle: this.menuTitle,
            buttons: [
                { text: '1', arg: '1' },
                { text: '2', arg: '2' },
                { text: '3', arg: '3' },
                { text: '4', arg: '4' },
                { text: '5', arg: '5' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose a bid.' };
    }

    menuCommand(player, bid) {
        this.game.addMessage('{0} has chosen a bid.', player);
        
        player.honorBid = bid;
        
        return true;
    }
}

module.exports = HonorBidPrompt;
