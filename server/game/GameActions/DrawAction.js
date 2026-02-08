const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.refill = false;
        this.bonus = false;
    }

    setup() {
        super.setup();
        this.name = 'draw';
        this.effectMsg = 'draw ' + this.amount + ' card' + (this.amount > 1 ? 's' : '');
    }

    canAffect(player, context) {
        return (this.amount !== 0 || this.refill) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getAmountAndShedChains(player) {
        let shedChains = false;
        let amount = 0;
        if (this.refill) {
            if (player.maxHandSize > player.hand.length) {
                amount =
                    player.maxHandSize - player.hand.length - Math.floor((player.chains + 5) / 6);
                shedChains = player.chains > 0;
            }
        } else {
            amount = this.amount;
        }
        return [amount, shedChains];
    }

    getEventWithAmount(player, context, amount, refill, shedChains) {
        return super.createEvent(
            EVENTS.onDrawCards,
            {
                player: player,
                amount: amount,
                bonus: this.bonus,
                shedChains: shedChains,
                context: context
            },
            (event) => {
                if (event.amount > 0) {
                    const logDraw = !this.bonus;
                    const refillSuffix = refill
                        ? ` to refill their hand to ${player.hand.length + amount} cards`
                        : '';
                    event.player.drawCardsToHand(amount, { logDraw, refillSuffix });
                }

                if (shedChains) {
                    event.player.modifyChains(-1);
                    context.game.addMessage(
                        '{0} sheds 1 chain to {1} chains',
                        event.player,
                        event.player.chains
                    );
                }
            }
        );
    }

    getEventArray(context) {
        // If any player has to draw one at a time during their turn,
        // split them up and make individual events for each draw.
        let oneAtATimeTargets = this.target.filter(
            (p) => p.anyEffect('drawOneAtATimeDuringTurn') && context.game.activePlayer === p
        );
        let events = this.target
            .filter((p) => !oneAtATimeTargets.includes(p))
            .filter((target) => this.canAffect(target, context))
            .map((target) => this.getEvent(target, context));

        for (let player of oneAtATimeTargets) {
            let [amount, shedChains] = this.getAmountAndShedChains(player);
            let event = null;
            let prevEvent = null;
            for (let i = 0; i < amount; i++) {
                let nextDrawEvent = this.getEventWithAmount(
                    player,
                    context,
                    1,
                    i === amount - 1 ? this.refill : false,
                    i === amount - 1 ? shedChains : false
                );
                if (event === null) {
                    event = nextDrawEvent;
                } else {
                    prevEvent.addSubEvent(nextDrawEvent);
                }
                prevEvent = nextDrawEvent;
            }
            if (event !== null) {
                events = events.concat(event);
            }
        }

        return events;
    }

    getEvent(player, context) {
        let [amount, shedChains] = this.getAmountAndShedChains(player);
        return this.getEventWithAmount(player, context, amount, this.refill, shedChains);
    }
}

module.exports = DrawAction;
