import _ from 'underscore';

function getDeckCount(deck) {
    var count = 0;

    _.each(deck, function(card) {
        count += card.count;
    });

    return count;
}

function hasTrait(card, trait) {
    var traits = card.card.traits;
    var split = traits.split('.');

    return _.any(split, function(t) {
        return t.toLowerCase() === trait.toLowerCase();
    });
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

    if(drawCount < 60) {
        status = 'Too few draw cards';
    }

    if(plotCount < 7) {
        status = 'Too few plot cards';
    }

    var combined = _.union(deck.plotCards, deck.drawCards);

    if(_.any(combined, function(card) {
        return card.count > card.card.deck_limit;
    })) {
        status = 'Invalid';
    }

    if(plotCount > 7) {
        status = 'Invalid';
    }

    // Kings of summer        
    if(deck.agenda && deck.agenda.code === '04037' && _.any(deck.plotCards, card => {
        return hasTrait(card, 'winter');
    })) {
        status = 'Invalid';
    }

    // Kings of winter        
    if(deck.agenda && deck.agenda.code === '04038' && _.any(deck.plotCards, card => {
        return hasTrait(card, 'summer');
    })) {
        status = 'Invalid';
    }

    var bannerCount = 0;

    if(!_.all(combined, card => {
        var faction = card.card.faction_code.toLowerCase();
        var bannerCard = false;

        if(deck.agenda && isBannerCard(deck.agenda.code, faction) && !card.card.is_loyal) {
            bannerCount += card.count;
            bannerCard = true;
        }

        return bannerCard || faction === deck.faction.value.toLowerCase() || faction === 'neutral';
    })) {
        status = 'Invalid';
    }

    if(bannerCount > 0 && bannerCount < 12) {
        status = 'Invalid';
    }

    return { status: status, plotCount: plotCount, drawCount: drawCount };
}
