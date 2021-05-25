const CardGameAction = require('./CardGameAction');

class PlaceUnderAction extends CardGameAction {
    constructor(propertyFactory, isGraft = false) {
        super(propertyFactory);
        this.isGraft = isGraft;
    }

    setDefaultProperties() {
        this.facedown = false;
        this.parent = null;
    }

    setup() {
        super.setup();
        this.name = this.isGraft ? 'graft' : 'placeUnder';
        this.effectArgs = this.parent;
        if (this.isGraft) {
            this.effectMsg = 'graft {0} onto {1}';
        } else {
            this.effectMsg = 'place ' + (this.facedown ? 'a card' : '{0}') + ' under {1}';
        }
    }

    canAffect(card, context) {
        return this.parent && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(
            this.isGraft ? 'onCardGrafted' : 'onPlaceUnder',
            { card, context },
            () => {
                card.controller.removeCardFromPile(card);
                card.controller = card.owner;
                card.parent = this.parent;
                card.moveTo(this.isGraft ? 'grafted' : 'purged');
                card.facedown = this.facedown;
                this.parent.childCards.push(card);
            }
        );
    }
}

module.exports = PlaceUnderAction;
