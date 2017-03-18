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

function isBannerCard(bannerCode, faction) {
    switch(bannerCode) {
        // Banner of the stag
        case '01198':
            return faction === 'baratheon';
        // Banner of the kraken
        case '01199':
            return faction === 'greyjoy';
        // Banner of the lion
        case '01200':
            return faction === 'lannister';
        // Banner of the sun
        case '01201':
            return faction === 'martell';
        // Banner of the watch
        case '01202':
            return faction === 'thenightswatch';
        // Banner of the wolf
        case '01203':
            return faction === 'stark';
        // Banner of the dragon
        case '01204':
            return faction === 'targaryen';
        // Banner of the rose
        case '01205':
            return faction === 'tyrell';
    }

    return false;
}

export function validateDeck(deck) {
    var plotCount = getDeckCount(deck.plotCards);
    var drawCount = getDeckCount(deck.drawCards);
    var status = 'Valid';
    var requiredPlots = 7;
    var isRains = false;
    var extendedStatus = [];
    var requiredDraw = 60;
    if(_.any(deck.drawCards, card => {
        return !card.card.faction_code;
    })) {
        status = 'Invalid';
        extendedStatus.push('Deck contains invalid cards');
        
        return { status: status, plotCount: plotCount, drawCount: drawCount, extendedStatus: extendedStatus };
    }
    var combined = _.union(deck.plotCards, deck.drawCards);

    // Alliance 
    if(deck.agenda && deck.agenda.code === '06018') {
        requiredDraw = 75;
        _.each(deck.bannerCards, banner => {
            var hasLoyalBannerCard = false;
            var banneredCards = _.reduce(combined, (memo, card) => {
                var faction = card.card.faction_code.toLowerCase();
                if(isBannerCard(banner.code, faction) && !card.card.is_loyal) {
                    return memo + card.count;          
                }
                if(isBannerCard(banner.code, faction) && card.card.is_loyal) {
                    hasLoyalBannerCard = true;
                }
                return memo;
            }, 0);
            if(banneredCards < 12) {
                status = 'Invalid';
                extendedStatus.push('Too few banner cards for ' + banner.label);
            }
            if(hasLoyalBannerCard) {
                status = 'Invalid';
                extendedStatus.push('Has a loyal banner card');
            }
        });   
    }
    
    // "The Rains of Castamere"
    if(deck.agenda && deck.agenda.code === '05045') {
        isRains = true;
        requiredPlots = 12;
    }

    if(drawCount < requiredDraw) {
        status = 'Invalid';
        extendedStatus.push('Too few draw cards');
    }

    if(plotCount < requiredPlots) {
        status = 'Invalid';
        extendedStatus.push('Too few plot cards');
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

    if(plotCount > requiredPlots) {
        extendedStatus.push('Too many plots');
        status = 'Invalid';
    }

    if(isRains) {
        var schemePlots = _.filter(deck.plotCards, plot => {
            return hasTrait(plot, 'Scheme');
        });

        var groupedSchemes = _.groupBy(schemePlots, plot => {
            return plot.card.code;
        });

        if(_.size(groupedSchemes) !== 5 && !_.all(groupedSchemes, plot => {
            return plot.count === 1;
        })) {
            extendedStatus.push('Rains requires 5 different scheme plots');
            status = 'Invalid';
        }
    }
   
    // Kings of summer
    if(deck.agenda && deck.agenda.code === '04037' && _.any(deck.plotCards, card => {
        return hasTrait(card, 'winter');
    })) {
        extendedStatus.push('Kings of Summer cannot include Winter plots');
        status = 'Invalid';
    }

    // Kings of winter
    if(deck.agenda && deck.agenda.code === '04038' && _.any(deck.plotCards, card => {
        return hasTrait(card, 'summer');
    })) {
        extendedStatus.push('Kings of Winter cannot include Summer plots');
        status = 'Invalid';
    }

    if(deck.agenda && deck.agenda.code === '01027' && _.reduce(deck.drawCards, (counter, card) => {
        return card.card.faction_code === 'neutral' ? counter + card.count : counter;
    }, 0) > 15) {
        status = 'Invalid';
        extendedStatus.push('You cannot include more than 15 neutral cards in a deck with Fealty');
    }

    var bannerCount = 0;

    if((!deck.agenda || deck.agenda && deck.agenda.code !== '06018') && !_.all(combined, card => {
        var faction = card.card.faction_code.toLowerCase();
        var bannerCard = false;

        if(deck.agenda && isBannerCard(deck.agenda.code, faction) && !card.card.is_loyal) {
            bannerCount += card.count;
            bannerCard = true;
        }

        return bannerCard || faction === deck.faction.value.toLowerCase() || faction === 'neutral';
    })) {
        extendedStatus.push('Too many out of faction cards');
        status = 'Invalid';
    }

    if(bannerCount > 0 && bannerCount < 12) {
        extendedStatus.push('Not enough banner faction cards');
        status = 'Invalid';
    }

    return { status: status, plotCount: plotCount, drawCount: drawCount, extendedStatus: extendedStatus };
}
