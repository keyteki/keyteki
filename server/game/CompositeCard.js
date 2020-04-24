const Card = require('./Card.js');

class CompositeCard extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.playedParts = [];

        this.compositeImageId = null;
        this.compositeParts = [];
    }

    moveTo(targetLocation) {
        super.moveTo(targetLocation);

        if(this.location === 'play area') {
            this.compositeParts.forEach(id => {
                // Always remove the second part from hand
                let part = this.controller.getSourceList('hand').find(card => id === card.id);
                this.controller.removeCardFromPile(part);
                this.playedParts.push(part);
            });

            this.image = this.compositeImageId || this.id;
        } else {
            let cardPile = this.controller.getSourceList(this.location);
            let cardIndex = cardPile.indexOf(this);
            this.playedParts.forEach(part => {
                part.location = this.location;
                cardPile.splice(cardIndex, 0, part);
            });
            this.playedParts = [];
            this.image = this.id;
        }
    }
}

module.exports = CompositeCard;
