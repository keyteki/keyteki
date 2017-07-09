const _ = require('underscore');
const moment = require('moment');

function getDeckCount(deck) {
    let count = 0;

    _.each(deck, function(card) {
        count += card.count;
    });

    return count;
}

function hasTrait(card, trait) {
    return card.card.traits && card.card.traits.toLowerCase().indexOf(trait.toLowerCase() + '.') !== -1;
}

function getStronghold(deck) {
    var stronghold;
    _.each(deck, card => {
        if(card.card.type === 'stronghold') {
            stronghold = card.card;
        }
    });

    return stronghold;
}

function isCardInReleasedPack(packs, card) {
    let pack = _.find(packs, pack => {
        return card.card.pack_code === pack.code;
    });

    if(!pack) {
        return false;
    }

    let releaseDate = pack.available || pack.date_release;

    if(!releaseDate) {
        return false;
    }

    releaseDate = moment(releaseDate, 'YYYY-MM-DD');
    let now = moment();

    return releaseDate <= now;
}

export function validateDeck(deck, packs) {
    var provinceCount = getDeckCount(deck.provinceCards);
    var conflictDrawCount = getDeckCount(deck.conflictDrawCards);
    var dynastyDrawCount = getDeckCount(deck.dynastyDrawCards);
    var status = 'Valid';
    var requiredProvinces = 5;
    var stronghold = getStronghold(deck.stronghold);
    var influenceTotal = 0;
    var extendedStatus = [];
    var minDraw = 40;
    var maxDraw = 45;
    var airCount = 0;
    var earthCount = 0;
    var fireCount = 0;
    var waterCount = 0;
    var voidCount = 0;
    var isValid = true;

    if(_.any(deck.stronghold, card => {
        return !card.card.faction;
    })) {
        status = 'Invalid';
        extendedStatus.push('Deck contains invalid cards');
        
        return { status: status, provinceCount: provinceCount, conflictDrawCount: conflictDrawCount, dynastyDrawCount: dynastyDrawCount, extendedStatus: extendedStatus };
    }
    var combined = _.union(deck.provinceCards, deck.stronghold, deck.conflictDrawCards, deck.dynastyDrawCards);

    var combined_clan = _.union(deck.provinceCards, deck.stronghold, deck.dynastyDrawCards);    
    
    if(conflictDrawCount < minDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few conflict cards');
    }

    if(dynastyDrawCount < minDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few dynasty cards');
    }

    if(conflictDrawCount > maxDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too many conflict cards');
    }

    if(dynastyDrawCount > maxDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too many dynasty cards');
    }

    if(provinceCount < requiredProvinces) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few province cards');
    }  
    
    if(provinceCount > requiredProvinces) {
        extendedStatus.push('Too many provinces');
        status = 'Invalid';
        isValid = false;
    }

    //Ensure one province of each element
    _.each(deck.provinceCards, card => {
        if(card.card.element === 'air') {
            airCount++;
        } else if(card.card.element === 'earth') {
            earthCount++;
        } else if(card.card.element === 'fire') {
            fireCount++;
        } else if(card.card.element === 'water') {
            waterCount++;
        } else if(card.card.element === 'void') {
            voidCount++;
        }
    });

    if(airCount > 1) {
        extendedStatus.push('Too many air provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(earthCount > 1) {
        extendedStatus.push('Too many earth provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(fireCount > 1) {
        extendedStatus.push('Too many fire provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(waterCount > 1) {
        extendedStatus.push('Too many water provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(voidCount > 1) {
        extendedStatus.push('Too many void provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(_.any(combined, card => {
        if(card.count > card.card.deck_limit) {
            extendedStatus.push(card.card.label + ' has limit ' + card.card.deck_limit);

            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    //Check for out of faction cards in stronghold, provinces, dynasty
    if(_.any(combined_clan, card => {
        if(!(_.contains([deck.faction.value,'neutral'],card.card.clan))) {

            //console.log(card.card.label + ' has clan ' + card.card.clan);
            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    //Check for out of faction cards in conflict
    if(_.any(deck.conflictDrawCards, card => {
        if(!(_.contains([deck.faction.value, deck.allianceFaction.value, 'neutral'],card.card.clan))) {

            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    if(stronghold) {

        //Total up influence count
        _.each(deck.conflictDrawCards, card => {
            if(card.card.clan === deck.allianceFaction.value) {
                influenceTotal = influenceTotal + (card.card.influence_cost * card.count);
            }
        });

        if(influenceTotal > stronghold.influence) {
            extendedStatus.push('Not enough influence');
            status = 'Invalid';
            isValid = false;
        }
    } else {
        extendedStatus.push('No stronghold chosen');
        status = 'Invalid';
        isValid = false;
    }

    if(isValid) {
        let unreleasedCards = _.reject(combined, card => {
            return isCardInReleasedPack(packs, card);
        });

        if(_.size(unreleasedCards) !== 0) {
            status = 'Unreleased Cards';

            _.each(unreleasedCards, card => {
                extendedStatus.push(card.card.label + ' is not yet released');
            });
        }
    }

    return { status: status, provinceCount: provinceCount, conflictDrawCount: conflictDrawCount, dynastyDrawCount: dynastyDrawCount, extendedStatus: extendedStatus, isValid: isValid };
}
