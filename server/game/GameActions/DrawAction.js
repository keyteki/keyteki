const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'draw';
        this.effectMsg = 'draw ' + this.amount + ' cards';
    }

    canAffect(player, context) {
        return this.amount === 0 ? false : super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent('onDrawCards', { 
            player: player, 
            amount: this.amount, 
            context: context
        }, () => player.drawCardsToHand(this.amount));
    }
}

module.exports = DrawAction;
