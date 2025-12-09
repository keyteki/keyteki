const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class ActivateProphecyAction extends PlayerAction {
    setDefaultProperties() {
        this.prophecyCard = null;
        this.cardFromHand = null;
    }

    setup() {
        super.setup();
        this.name = 'activateProphecy';
        this.effectMsg = 'activate {0}';
        this.effectArgs = () => [this.prophecyCard];
    }

    defaultTargets(context) {
        return context.player;
    }

    canAffect(player, context) {
        return (
            this.prophecyCard &&
            player.canActivateProphecy(this.prophecyCard) &&
            player.hand.length > 0 &&
            super.canAffect(player, context)
        );
    }

    getEvent(player, context) {
        return super.createEvent(EVENTS.onActivateProphecy, { player, context }, (event) => {
            if (event.player.activateProphecy(context, this.prophecyCard)) {
                if (this.cardFromHand) {
                    context.game.actions
                        .placeUnder({ parent: this.prophecyCard })
                        .resolve(this.cardFromHand, context);
                } else {
                    context.game.promptForSelect(player, {
                        activePromptTitle:
                            'Choose a card from your hand to place under the prophecy',
                        location: 'hand',
                        controller: 'self',
                        source: this.prophecyCard,
                        cardCondition: (card) => card.location === 'hand',
                        onSelect: (player, card) => {
                            context.game.actions
                                .placeUnder({
                                    parent: this.prophecyCard,
                                    facedown: true
                                })
                                .resolve(card, context);
                            return true;
                        }
                    });
                }
            }
        });
    }
}

module.exports = ActivateProphecyAction;
