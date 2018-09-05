const CardGameAction = require('./CardGameAction');

class PlaceUnderAction extends CardGameAction {
    setDefaultProperties() {
        this.facedown = false;
        this.parent = null;
    }

    setup() {
        super.setup();
        this.name = 'placeUnder';
        this.effectMsg = 'place ' + (this.facedown ? 'a card' : '{0}') + ' under {1}';
        this.effectArgs = this.parent;
    }

    canAffect(card, context) {
        return this.parent && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onPlaceUnder', { card, context }, () => {
            card.controller.removeCardFromPile(card);
            card.controller = card.owner;
            card.parent = this.parent;
            card.moveTo('purged');
            card.facedown = this.facedown;
            this.parent.childCards.push(card);
        });
    }
}

module.exports = PlaceUnderAction;
