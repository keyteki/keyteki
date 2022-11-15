const Card = require('./Card.js');

class TokenCard extends Card {
    constructor(owner, cardData, versusCard) {
        super(owner, cardData);
        this.versusCard = versusCard;
        this.setupAbilities();
        this.location = versusCard ? versusCard.location : 'deck';
        this.applyAnyLocationPersistentEffects();

        if (this.printedType === 'token creature') {
            this.printedType = 'creature';
        }
    }

    isToken() {
        return true;
    }
}

module.exports = TokenCard;
