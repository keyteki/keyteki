const PlayerAction = require('./PlayerAction');
const MoveFateEvent = require('../Events/MoveFateEvent');

class TransferFateAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'takeFate';
        this.effectMsg = 'take ' + this.amount + ' fate from {0}';
        this.cost = 'giving ' + this.amount + ' fate to their opponent';
    }

    canAffect(player, context) {
        return player.opponent && this.amount > 0 && player.fate >= this.amount && super.canAffect(player, context);
    }

    getEvent(player, context) {
        return new MoveFateEvent({ context: context, player: player }, this.amount, player, player.opponent, this);
    }
}

module.exports = TransferFateAction;
