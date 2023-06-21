const CardGameAction = require('./CardGameAction');

class MoveUpgrade extends CardGameAction {
    setDefaultProperties() {
        this.upgrades = null;
    }

    setup() {
        this.name = 'moveUpgrade';
        this.targetType = ['creature'];
        this.effectMsg = 'move {1} to {0}';
        this.effectArgs = () => {
            return this.upgrades;
        };
    }

    canAffect(card, context) {
        if (!context || !context.player || !card || card.location !== 'play area') {
            return false;
        }

        if (!this.upgrades || !this.upgrades.some((upgrade) => upgrade.canAttach(card, context))) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEventArray(context) {
        return this.target
            .filter((target) => this.canAffect(target, context))
            .reduce(
                (events, target) =>
                    events.concat(
                        this.upgrades.map((upgrade) => this.getEvent(target, context, upgrade))
                    ),
                []
            );
    }

    checkEventCondition(event) {
        if (
            !event.context ||
            !event.context.player ||
            !event.parent ||
            event.parent.location !== 'play area'
        ) {
            return false;
        }
        return event.card.checkRestrictions(this.name, event.context, event);
    }

    getEvent(card, context, upgrade) {
        return super.createEvent(
            'onUpgradeMoved',
            { card: upgrade, parent: card, player: context.player, context: context },
            (event) => {
                event.card.parent.removeAttachment(event.card);
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

module.exports = MoveUpgrade;
