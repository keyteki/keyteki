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
    var airCount = 0;
    var earthCount = 0;
    var fireCount = 0;
    var waterCount = 0;
    var voidCount = 0;
    //Update for influence
    if(_.any(deck.drawCards, card => {
        return !card.card.faction_code;
    })) {
        status = 'Invalid';
        extendedStatus.push('Deck contains invalid cards');
        
        return { status: status, provinceCount: provinceCount, conflictDrawCount: conflictDrawCount, dynastyDrawCount: dynastyDrawCount, extendedStatus: extendedStatus };
    }
    var combined = _.union(deck.provinceCards, deck.drawCards, deck.conflictDrawCards, deck.dynastyDrawCards);

    
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

    //Ensure one province of each element
    _.each(deck.provinceCards, card => {
                if(card.card.element === 'air'){
                    airCount++;
                } else if(card.card.element === 'earth'){
                    earthCount++;
                } else if(card.card.element === 'fire'){
                    fireCount++;
                } else if(card.card.element === 'water'){
                    waterCount++;
                } else if(card.card.element === 'void'){
                    voidCount++;
                }
            });

    if(airCount > 1) {
        extendedStatus.push('Too many air provinces');
        status = 'Invalid';
    }

    if(earthCount > 1) {
        extendedStatus.push('Too many earth provinces');
        status = 'Invalid';
    }

    if(fireCount > 1) {
        extendedStatus.push('Too many fire provinces');
        status = 'Invalid';
    }

    if(waterCount > 1) {
        extendedStatus.push('Too many water provinces');
        status = 'Invalid';
    }

    if(voidCount > 1) {
        extendedStatus.push('Too many void provinces');
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
