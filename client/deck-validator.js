import _ from 'underscore';

function getDeckCount(deck) {
    var count = 0;

    _.each(deck, function(card) {
        count += card.count;
    });

    return count;
}

function hasTrait(card, trait) {
    return card.card.traits && card.card.traits.toLowerCase().indexOf(trait.toLowerCase() + '.') !== -1;
}

export function validateDeck(deck) {
    var provinceCount = getDeckCount(deck.provinceCards);
    var conflictDrawCount = getDeckCount(deck.conflictDrawCards);
    var dynastyDrawCount = getDeckCount(deck.dynastyDrawCards);
    var status = 'Valid';
    var requiredProvinces = 5;
    var extendedStatus = [];
    var minDraw = 40;
    var maxDraw = 45;
    //Update for influence
    if(_.any(deck.drawCards, card => {
        return !card.card.faction_code;
    })) {
        status = 'Invalid';
        extendedStatus.push('Deck contains invalid cards');
        
        return { status: status, provinceCount: provinceCount, conflictDrawCount: conflictDrawCount, dynastyDrawCount: dynastyDrawCount, extendedStatus: extendedStatus };
    }
    var combined = _.union(deck.plotCards, deck.drawCards);

    
    if(conflictDrawCount < minDraw) {
        status = 'Invalid';
        extendedStatus.push('Too few conflict cards');
    }

    if(dynastyDrawCount < minDraw) {
        status = 'Invalid';
        extendedStatus.push('Too few dynasty cards');
    }

    if(conflictDrawCount > maxDraw) {
        status = 'Invalid';
        extendedStatus.push('Too many conflict cards');
    }

    if(dynastyDrawCount > maxDraw) {
        status = 'Invalid';
        extendedStatus.push('Too many dynasty cards');
    }

    if(provinceCount < requiredProvinces) {
        status = 'Invalid';
        extendedStatus.push('Too few province cards');
    }  
    
    if(provinceCount > requiredProvinces) {
        extendedStatus.push('Too many provinces');
        status = 'Invalid';
    }

    if(_.any(combined, card => {
        if(card.count > card.card.deck_limit) {
            extendedStatus.push(card.card.label + ' has limit ' + card.card.deck_limit);

            return true;
        }

        return false;
    })) {
        status = 'Invalid';
    }


    return { status: status, provinceCount: provinceCount, conflictDrawCount: conflictDrawCount, dynastyDrawCount: dynastyDrawCount, extendedStatus: extendedStatus };
}
