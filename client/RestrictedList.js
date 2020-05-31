const restrictedList = {
    version: '1.4',
    cards: [
        'mirumoto-s-fury',
        'for-greater-glory',
        'against-the-waves',
        'forged-edict',
        'charge',
        'pathfinder-s-blade',
        'policy-debate',
        'iron-mine'
    ]
};

class RestrictedList {
    validate(cards) {
        let cardsOnRestrictedList = cards.filter((card) => restrictedList.cards.includes(card.id));

        let errors = [];

        if (cardsOnRestrictedList.length > 1) {
            errors.push(
                `Contains more than 1 card on the FAQ v${
                    restrictedList.version
                } restricted list: ${cardsOnRestrictedList.map((card) => card.name).join(', ')}`
            );
        }

        return {
            version: restrictedList.version,
            valid: errors.length === 0,
            errors: errors,
            restrictedCards: cardsOnRestrictedList
        };
    }
}

module.exports = RestrictedList;
