const CardGameAction = require('./CardGameAction');

class MoveUpgradeToFlankAction extends CardGameAction {
    setDefaultProperties() {
        this.flank = null;
        this.left = false;
        this.controller = null;
    }

    update(context) {
        this.applyProperties(
            Object.assign(
                { target: this.getDefaultTargets(context), origin: context.source },
                this.propertyFactory(context)
            )
        );
    }

    setup() {
        this.name = 'moveUpgradeToFlank';
        this.targetType = ['upgrade'];
        this.effectMsg = 'move {0} to a flank';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        if (!this.flank) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Which flank do you want to move this upgrade to?',
                context: context,
                source: this.target.length > 0 ? this.target[0] : context.source,
                choices: ['Left', 'Right'],
                choiceHandler: (choice) => (this.left = choice === 'Left')
            });
        } else {
            this.left = this.flank === 'Left';
        }
    }

    getEvent(card, context) {
        return super.createEvent('onMoveToFlank', { card: card, context: context }, (event) => {
            if (this.controller) {
                // TODO this is arguable as the card does not state it gives control
                event.card.setDefaultController(this.controller);
            }

            event.card.parent.removeAttachment(event.card);

            if (this.left) {
                card.controller.cardsInPlay.unshift(card);
            } else {
                card.controller.cardsInPlay.push(card);
            }
        });
    }
}

module.exports = MoveUpgradeToFlankAction;
