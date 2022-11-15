const Card = require('./Card.js');

class TokenCard extends Card {
    constructor(owner, cardData, versusCard) {
        super(owner, cardData);
        this.versusCard = versusCard;
        this.setupAbilities();
        this.location = versusCard.location;
        this.applyAnyLocationPersistentEffects();
    }

    isToken() {
        return true;
    }
}

module.exports = TokenCard;
