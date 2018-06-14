const PlayerAction = require('./PlayerAction');

class ModifyBidAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.direction = 'increase';
        this.promptPlayer = false;
    }

    setup() {
        super.setup();
        this.name = 'modifyBid';
        if(this.promptPlayer) {
            this.effectMsg = 'modify their honor bid by ' + this.amount;
        } else {
            this.effectMsg = this.direction + ' their bid by ' + this.amount;
        }
    }

    canAffect(player, context) {
        if(this.amount === 0 || this.direction !== 'increase' && player.honorBid === 0) {
            return false;
        }
        return super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        if(!this.promptPlayer || this.target.length !== 1) {
            return;
        }
        let player = this.target[0];
        if(player.honorBid === 0) {
            this.direction = 'increase';
            return;
        }
        context.game.promptWithHandlerMenu(player, {
            context: context, 
            choices: ['Increase honor bid', 'Decrease honor bid'],
            handlers: [
                () => this.direction = 'increase',
                () => this.direction = 'decrease'
            ]
        });
    }

    getEvent(player, context) {
        let params = {
            player: player, 
            amount: this.amount, 
            direction: this.direction,
            context: context
        };
        return super.createEvent('onModifyBid', params, event => {
            if(event.direction === 'increase') {
                player.honorBid += this.amount;
            } else {
                player.honorBid = Math.max(player.honorBid - this.amount, 0);
            }
        });
    }
}

module.exports = ModifyBidAction;
