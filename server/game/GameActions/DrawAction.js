const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class DrawAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.refill = false;
        this.bonus = false;
        this.effectMsg = null;
    }

    setup() {
        const customEffectMsg = this.effectMsg;
        super.setup();
        this.name = 'draw';
        this.customEffectMsg = customEffectMsg;
        // Default effectMsg set here, may be updated in update() based on target
        this.effectMsg = `draw ${this.amount} card${this.amount > 1 ? 's' : ''}`;
    }

    update(context) {
        this.effectMsg = null;
        super.update(context);
        // After target is set, update effectMsg based on whether target is opponent
        if (!this.customEffectMsg && this.target.length > 0) {
            const isOpponent = this.target.some((t) => t !== context.player);
            if (isOpponent) {
                this.effectMsg = `make {0} draw ${this.amount} card${this.amount > 1 ? 's' : ''}`;
            }
        } else if (this.customEffectMsg) {
            this.effectMsg = this.customEffectMsg;
        }
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
                // Show event message for draws (self-draws are also mentioned in ability message,
                // but displaying both is standard behavior)
                if (!this.bonus && event.amount > 0) {
                    context.game.addMessage(
                        '{0} draws {1} card{2}{3}',
                        player,
                        amount,
                        amount > 1 ? 's' : '',
                        refill ? ` to their maximum of ${player.maxHandSize}` : ''
                    );
                }

                if (event.amount > 0) {
                    event.player.drawCardsToHand(amount);
                }

                if (shedChains) {
                    event.player.modifyChains(-1);
                    context.game.addMessage(
                        "{0}'s chains are reduced by 1 to {1}",
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
