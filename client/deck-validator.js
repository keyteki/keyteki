const $ = require('jquery'); // eslint-disable-line no-unused-vars
const _ = require('underscore');
const moment = require('moment');


function getDeckCount(deck) {
    let count = 0;

    _.each(deck, function(card) {
        count += card.count;
    });

    return count;
}

function getStronghold(deck) {
    var stronghold;
    _.each(deck, card => {
        if(card.card.type === 'stronghold') {
            stronghold = card;
        }
    });

    return stronghold;
}

function isCardInReleasedPack(packs, card) { // eslint-disable-line no-unused-vars
    let cardPack = card.pack_cards[0].pack.id;
    let pack = _.find(packs, pack => {
        return cardPack === pack.id;
    });

    if(!pack) {
        return false;
    }

    let releaseDate = pack.available || pack.released_at;

    if(!releaseDate) {
        return false;
    }

    releaseDate = moment(releaseDate, 'YYYY-MM-DD');
    let now = moment();

    return releaseDate <= now;
}

module.exports = function validateDeck(deck, packs) { // eslint-disable-line no-unused-vars
    var provinceCount = getDeckCount(deck.provinceCards);
    var conflictCount = getDeckCount(deck.conflictCards);
    var dynastyCount = getDeckCount(deck.dynastyCards);
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
    var voidCount = 0;
    var waterCount = 0;
    let provinceMax = {
        air: 1,
        earth: 1,
        fire: 1,
        void: 1,
        water: 1
    };
    let roleType = undefined;
    let roleElement = undefined;
    var isValid = true;

    if(_.any(deck.stronghold, card => {
        return !card.card.clan;
    })) {
        status = 'Invalid';
        extendedStatus.push('Deck contains invalid cards');

        return { status: status, provinceCount: provinceCount, conflictCount: conflictCount, dynastyCount: dynastyCount, extendedStatus: extendedStatus };
    }
    var combined = _.union(deck.provinceCards, deck.stronghold, deck.conflictCards, deck.dynastyCards);

    var combinedClan = _.union(deck.provinceCards, deck.stronghold, deck.dynastyCards);

    if(conflictCount < minDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few conflict cards');
    }

    if(dynastyCount < minDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few dynasty cards');
    }

    if(conflictCount > maxDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too many conflict cards');
    }

    if(dynastyCount > maxDraw) {
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

    if(deck.role && deck.role['0'] && deck.role['0'].card) {
        let roleIdArray = deck.role['0'].card.id.split('-');
        roleType = roleIdArray[0];
        roleElement = roleIdArray[2];

        if(roleType === 'seeker') {
            provinceMax[roleElement] = 2;
        }
    }

    if(airCount > provinceMax['air']) {
        extendedStatus.push('Too many air provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(earthCount > provinceMax['earth']) {
        extendedStatus.push('Too many earth provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(fireCount > provinceMax['fire']) {
        extendedStatus.push('Too many fire provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(voidCount > provinceMax['void']) {
        extendedStatus.push('Too many void provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(waterCount > provinceMax['water']) {
        extendedStatus.push('Too many water provinces');
        status = 'Invalid';
        isValid = false;
    }

    if(_.any(combined, card => {
        if(card.count > card.card.deck_limit) {
            extendedStatus.push(card.card.name + ' has limit ' + card.card.deck_limit);

            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    //Check for out of faction cards in stronghold, provinces, dynasty
    if(_.any(combinedClan, card => {
        if(!(_.contains([deck.faction.value,'neutral'],card.card.clan))) {
            extendedStatus.push(card.card.name + ' is not in faction ' + deck.faction.value);
            //console.log(card.card.label + ' has clan ' + card.card.clan);
            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    //Check for out of faction cards in conflict
    if(_.any(deck.conflictCards, card => {
        if(!(_.contains([deck.faction.value, deck.alliance.value, 'neutral'],card.card.clan))) {
            extendedStatus.push(card.card.name + ' is not in faction ' + deck.faction.value);
            return true;
        }

        return false;
    })) {
        status = 'Invalid';
        isValid = false;
    }

    if(stronghold) {
        let influenceMax = stronghold.card.influence_pool;

        if(roleType === 'keeper') {
            influenceMax = influenceMax + 3;
        }
        //Total up influence count
        _.each(deck.conflictCards, card => {
            if(card.card.clan === deck.alliance.value) {
                influenceTotal = influenceTotal + (card.card.influence_cost * card.count);
            }
        });

        if(influenceTotal > influenceMax) {
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
            return isCardInReleasedPack(packs, card.card);
        });

        if(_.size(unreleasedCards) !== 0) {
            status = 'Unreleased Cards';

            _.each(unreleasedCards, card => {
                extendedStatus.push(card.card.name + ' is not yet released');
            });
        }

    }

    return { status: status, provinceCount: provinceCount, conflictCount: conflictCount, dynastyCount: dynastyCount, extendedStatus: extendedStatus, isValid: isValid };
};


/*
module.exports = function validateDeckNew(deck, packs) { // eslint-disable-line no-unused-vars
    let provinceCount = getDeckCount(deck.provinceCards);
    let conflictCount = getDeckCount(deck.conflictCards);
    let dynastyCount = getDeckCount(deck.dynastyCards);
    let status = 'Valid';
    let extendedStatus = [];
    let isValid = true;

    let deckList = {};

    let apiUrl = 'https://api.fiveringsdb.com/';
    let path = 'deck-validation';
    let format = 'standard';

    let combined = _.union(deck.stronghold, deck.role, deck.provinceCards, deck.conflictCards, deck.dynastyCards);

    _.each(combined, card => {
        deckList[card.card.id] = card.count;
    });

    let JSONDeckList = JSON.stringify(deckList);

    let response = {};


    $.ajax({
        type: 'POST',
        url: apiUrl + path + '/' + format,
        data: JSONDeckList,
        dataType: 'json',
        async: false,
        success: function(data) {
            response = data;
        }
    });

    if(response.success) {
        let responseStatus = parseInt(response.status);
        switch(responseStatus) {
            case 0:
                extendedStatus.push('Deck is valid');
                break;
            case 1:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many copies of one or more cards');
                break;
            case 2:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too few Strongholds');
                break;
            case 3:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Strongholds');
                break;
            case 4:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Roles');
                break;
            case 5:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too few Dynasty cards');
                break;
            case 6:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Dynasty cards');
                break;
            case 7:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has off-clan Dynasty cards');
                break;
            case 8:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too few Conflict cards');
                break;
            case 9:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Conflict cards');
                break;
            case 10:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck does not have enough influence for its off-clan Conflict cards');
                break;
            case 11:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has more than one off-clan in its Conflict deck');
                break;
            case 12:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Character cards in its Conflict deck');
                break;
            case 13:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too few Provinces');
                break;
            case 14:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Provinces');
                break;
            case 15:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has too many Provinces of one Element');
                break;
            case 16:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has an off-clan Province');
                break;
            case 17:
                status = 'Invalid';
                isValid = false;
                extendedStatus.push('Deck has an off-clan Conflict card with no influence cost');
                break;
        }
    }

    return { status: status, provinceCount: provinceCount, conflictCount: conflictCount, dynastyCount: dynastyCount, extendedStatus: extendedStatus, isValid: isValid };
};
*/
