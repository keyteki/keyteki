const CardGameAction = require('./CardGameAction');

class AttachAction extends CardGameAction {
    setDefaultProperties() {
        this.upgrade = null;
        this.upgradeChosenOnResolution = false;
    }

    setup() {
        this.name = 'attach';
        this.targetType = ['character'];
        this.effectMsg = 'attach {1} to {0}';
        this.effectArgs = () => {
            return this.upgrade;
        };
    }

    canAffect(card, context) {
        if(!context || !context.player || !card || card.location !== 'play area') {
            return false;
        } else if(this.attachmentChosenOnResolution) {
            return super.canAffect(card, context);
        }
        if(!this.upgrade || !this.upgrade.canAttach(card, context)) {
            return false;
        }
        return card.allowAttachment(this.upgrade) && super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return this.canAffect(event.parent, event.context);
    }

    getEventArray(context) {
        this.attachmentChosenOnResolution = false;
        return super.getEventArray(context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardAttached', { card: this.upgrade, parent: card, context: context }, event => {
            if(event.card.location === 'play area') {
                event.card.parent.removeAttachment(event.card);
            } else {
                event.card.controller.removeCardFromPile(event.card);
                event.card.new = true;
                event.card.moveTo('play area');
            }
            event.parent.upgrades.push(event.card);
            event.card.parent = event.parent;
            event.card.controller = context.player;
        });
    }
}

module.exports = AttachAction;
