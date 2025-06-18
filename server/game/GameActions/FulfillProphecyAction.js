const PlayerAction = require('./PlayerAction');

class FulfillProphecyAction extends PlayerAction {
    setDefaultProperties() {
        this.card = null;
    }

    setup() {
        super.setup();
        this.name = 'fulfillProphecy';
        this.effectMsg = 'fulfill its prophecy';
    }

    defaultTargets(context) {
        return context.game.activePlayer;
    }

    canAffect(player, context) {
        if (!player) {
            return false;
        }

        return (
            super.canAffect(player, context) &&
            player !== this.card.controller &&
            this.card.childCards &&
            this.card.childCards.length > 0 &&
            this.card.activeProphecy
        );
    }

    getEvent(player, context) {
        return super.createEvent(
            'onFulfillProphecy',
            { player: player, card: this.card, context: context },
            () => {
                this.card.controller.deactivateProphecy(this.card);
                if (this.card.childCards && this.card.childCards.length > 0) {
                    let childCard = this.card.childCards[0];
                    childCard.facedown = false;
                    context.game.actions.resolveFate().resolve(childCard, context);
                }
            }
        );
    }
}

module.exports = FulfillProphecyAction;
