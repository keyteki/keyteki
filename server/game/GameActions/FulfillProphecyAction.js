const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class FulfillProphecyAction extends PlayerAction {
    setDefaultProperties() {
        this.card = null;
    }

    setup() {
        super.setup();
        this.name = 'fulfillProphecy';
        this.effectMsg = 'fulfill its prophecy';
        // Messaging is emitted directly from getEvent so we can attribute it
        // to the active player rather than the prophecy controller.
        this.defersMessage = true;
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
        context.game.addMessage("{0} fulfills {1}'s prophecy", player, this.card);
        return super.createEvent(
            EVENTS.onFulfillProphecy,
            { player: player, card: this.card, context: context },
            () => {
                this.card.controller.deactivateProphecy(this.card);
                if (this.card.childCards && this.card.childCards.length > 0) {
                    let childCard = this.card.childCards[0];
                    childCard.facedown = false;
                    context.game.addMessage(
                        '{0} resolves the fate effect of {1}',
                        player,
                        childCard
                    );
                    context.game.actions.resolveFate().resolve(childCard, context);
                }
            }
        );
    }
}

module.exports = FulfillProphecyAction;
