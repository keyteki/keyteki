import CardGameAction from './CardGameAction.js';

const locationsHiddenFromPurge = ['hand', 'archives'];

class PurgeAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'purge';
        this.effectMsg = 'purge {0}';
    }

    setDefaultProperties() {
        this.purgedBy = null;
    }

    canAffect(target, context) {
        if (context.source === target && locationsHiddenFromPurge.includes(target.location)) {
            return false;
        }
        return this.targetType.includes(target.type);
    }

    purge(card) {
        let composedPart = card.gigantic ? card.composedPart : null;
        card.owner.moveCard(card, 'purged');

        if (this.purgedBy) {
            this.purgedBy.purgedCards.push(card);
            card.purgedBy = this.purgedBy;
            if (composedPart) {
                this.purgedBy.purgedCards.push(composedPart);
                composedPart.purgedBy = this.purgedBy;
            }
        }
    }

    getEvent(card, context) {
        return super.createEvent('onCardPurged', { card: card, context: context }, () => {
            if (card.location === 'play area') {
                context.game.raiseEvent('onCardLeavesPlay', { card, context }, () =>
                    this.purge(card)
                );
            } else {
                this.purge(card);
            }
        });
    }
}

export default PurgeAction;
