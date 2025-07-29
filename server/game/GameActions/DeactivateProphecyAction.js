const PlayerAction = require('./PlayerAction');

class DeactivateProphecyAction extends PlayerAction {
    setDefaultProperties() {
        this.prophecyCard = null;
    }

    setup() {
        super.setup();
        this.name = 'deactivateProphecy';
        this.effectMsg = 'deactivate {0}';
        this.effectArgs = () => [this.prophecyCard];
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return (
            this.prophecyCard &&
            this.prophecyCard.isProphecy() &&
            this.prophecyCard.activeProphecy &&
            this.prophecyCard.controller === player &&
            super.canAffect(player, context)
        );
    }

    getEvent(player, context) {
        return super.createEvent('onDeactivateProphecy', { player, context }, (event) => {
            // Discard any cards under the prophecy
            if (this.prophecyCard.childCards && this.prophecyCard.childCards.length > 0) {
                let childCard = this.prophecyCard.childCards[0];
                context.game.actions.discard({ chatMessage: false }).resolve(childCard, context);
            }

            // Deactivate the prophecy
            event.player.deactivateProphecy(this.prophecyCard);

            context.game.addMessage(
                '{0} deactivates their prophecy {1}',
                event.player,
                this.prophecyCard
            );
        });
    }
}

module.exports = DeactivateProphecyAction;
