import _ from 'underscore';

function selectDeck(state, deck) {
    if(state.decks && state.decks.length !== 0) {
        state.selectedDeck = deck;
    } else {
        delete state.selectedDeck;
    }

    return state;
}

function processDecks(decks, state) {
    _.each(decks, deck => {
        if(!state.cards || !deck.houses) {
            deck.status = {};
            deck.cards = [];

            return;
        }

        deck.cards = _.map(deck.cards, card => {
            let result = { count: card.count, card: Object.assign({}, state.cards[card.id]), id: card.id, maverick: card.maverick, anomaly: card.anomaly };
            result.card.image = card.id;
            if(card.maverick) {
                result.card.house = card.maverick;
            } else if(card.anomaly) {
                result.card.house = card.anomaly;
            }

            return result;
        });

        deck.status = {
            basicRules: true,
            flagged: !!deck.flagged,
            verified: !!deck.verified,
            usageLevel: deck.usageLevel,
            noUnreleasedCards: true,
            officialRole: true,
            faqRestrictedList: true,
            faqVersion: 'v1.0',
            extendedStatus: []
        };
    });
}

export default function(state = { decks: [] }, action) {
    let newState;
    switch(action.type) {
        case 'RECEIVE_CARDS':
            return Object.assign({}, state, {
                cards: action.response.cards
            });
        case 'RECEIVE_FACTIONS':
            var factions = {};

            for(const faction of action.response.factions) {
                factions[faction.value] = faction;
            }

            return Object.assign({}, state, {
                factions: factions
            });
        case 'ZOOM_CARD':
            return Object.assign({}, state, {
                zoomCard: action.card
            });
        case 'CLEAR_ZOOM':
            return Object.assign({}, state, {
                zoomCard: undefined
            });
        case 'RECEIVE_DECKS':
            processDecks(action.response.decks, state);
            newState = Object.assign({}, state, {
                singleDeck: false,
                decks: action.response.decks
            });

            newState = selectDeck(newState, newState.decks[0]);

            return newState;
        case 'REQUEST_DECK':
            return Object.assign({}, state, {
                deckSaved: false,
                deckDeleted: false
            });
        case 'REQUEST_DECKS':
            newState = Object.assign({}, state, {
                deckSaved: false,
                deckDeleted: false
            });

            return newState;
        case 'RECEIVE_DECK':
            newState = Object.assign({}, state, {
                singleDeck: true,
                deckSaved: false
            });

            if(!newState.decks.some(deck => deck._id === action.response.deck._id)) {
                newState.decks.push(processDecks([action.response.deck], state));
            }

            var selected = newState.decks.find(deck => {
                return deck._id === action.response.deck._id;
            });

            newState = selectDeck(newState, selected);

            return newState;
        case 'SELECT_DECK':
            newState = Object.assign({}, state, {
                selectedDeck: action.deck,
                deckSaved: false
            });

            if(newState.selectedDeck) {
                processDecks([newState.selectedDeck], state);
            }

            return newState;
        case 'SAVE_DECK':
            newState = Object.assign({}, state, {
                deckSaved: false
            });

            return newState;
        case 'DECK_SAVED':
            var decks = state.decks;
            decks.unshift(action.response.deck);
            newState = Object.assign({}, state, {
                deckSaved: true,
                selectedDeck: action.response.deck,
                decks: decks
            });

            processDecks(newState.decks, state);

            return newState;
        case 'DECK_DELETED':
            newState = Object.assign({}, state, {
                deckDeleted: true
            });

            newState.decks = newState.decks.filter(deck => {
                return deck._id !== action.response.deckId;
            });

            newState.selectedDeck = newState.decks[0];

            return newState;
        case 'CLEAR_DECK_STATUS':
            return Object.assign({}, state, {
                deckDeleted: false,
                deckSaved: false
            });
        default:
            return state;
    }
}
