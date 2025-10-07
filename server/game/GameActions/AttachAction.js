import CardGameAction from './CardGameAction.js';

class AttachAction extends CardGameAction {
    setDefaultProperties() {
        this.upgrade = null;
        this.upgradeChosenOnResolution = false;
    }

    setup() {
        this.name = 'attach';
        this.targetType = ['creature'];
        if (this.upgrade && this.upgrade.anyEffect('canAttachToArtifacts')) {
            this.targetType = this.targetType.concat(['artifact']);
        }
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.upgrade;
        };
    }

    canAffect(card, context) {
        if (!context || !context.player || !card || card.location !== 'play area') {
            return false;
        } else if (this.upgradeChosenOnResolution) {
            return super.canAffect(card, context);
        }

        if (!this.upgrade || !this.upgrade.canAttach(card, context)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.parent, event.context);
    }

    getEventArray(context) {
        this.upgradeChosenOnResolution = false;
        return super.getEventArray(context);
    }

    getEvent(card, context) {
        return super.createEvent(
            'onCardAttached',
            { card: this.upgrade, parent: card, player: context.player, context: context },
            (event) => {
                if (event.card.location === 'play area') {
                    event.card.parent.removeAttachment(event.card);
                } else {
                    let controller = event.card.controller;
                    let oldTopOfDeck = controller.deck[0];
                    event.card.controller.removeCardFromPile(event.card);
                    event.card.new = true;
                    event.card.moveTo('play area');
                    controller.checkDeckAfterCardMove(oldTopOfDeck);
                }

                event.parent.upgrades.push(event.card);
                event.card.parent = event.parent;
                if (event.card.controller !== event.context.player) {
                    event.card.controller = event.context.player;
                    event.card.updateEffectContexts();
                }
            }
        );
    }
}

export default AttachAction;
