import { Decks } from '../types';

function selectDeck(state, deck) {
    if (state.decks && state.decks.length !== 0) {
        state.selectedDeck = deck;
    } else {
        delete state.selectedDeck;
    }

    return state;
}

function processDecks(decks, state) {
    for (let deck of decks) {
        if (!state.cards || !deck.houses) {
            deck.status = {};

            continue;
        }

        deck.cards = deck.cards.map((card) => {
            let result = {
                count: card.count,
                card: Object.assign({}, state.cards[card.id]),
                id: card.id,
                maverick: card.maverick,
                anomaly: card.anomaly,
                house: card.house,
                image: card.image,
                enhancements: card.enhancements,
                dbId: card.dbId,
                isNonDeck: card.isNonDeck
            };
            result.card.image = card.image || card.id;
            if (card.maverick) {
                result.card.house = card.maverick;
                result.card.maverick = card.maverick;
            } else if (card.anomaly) {
                result.card.house = card.anomaly;
                result.card.anomaly = card.anomaly;
            } else if (card.house) {
                result.card.house = card.house;
            }

            if (card.image) {
                result.card.image = card.image;
            }

            if (card.enhancements) {
                result.card.enhancements = card.enhancements;
            }

            return result;
        });

        let hasEnhancementsSet = true;

        if (deck.cards.some((c) => c.enhancements && c.enhancements[0] === '')) {
            hasEnhancementsSet = false;
        }

        deck.status = {
            basicRules: hasEnhancementsSet,
            flagged: !!deck.flagged,
            verified: !!deck.verified,
            usageLevel: deck.usageLevel,
            noUnreleasedCards: true,
            officialRole: true,
            extendedStatus: []
        };
    }
}

export default function (state = { decks: [], cards: {} }, action) {
    let newState;
    switch (action.type) {
        case 'RECEIVE_CARDS':
            var decks = state.decks;

            newState = Object.assign({}, state, {
                cards: action.response.cards
            });

            if (decks.length > 0) {
                processDecks(decks, newState);

                newState.decks = decks;
            }

            return newState;
        case 'RECEIVE_FACTIONS':
            var factions = {};

            for (const faction of action.response.factions) {
                factions[faction.value] = faction;
            }

            return Object.assign({}, state, {
                factions: factions
            });
        case Decks.DecksReceived:
            processDecks(action.response.decks, state);
            newState = Object.assign({}, state, {
                singleDeck: false,
                numDecks: action.response.numDecks,
                decks: action.response.decks
            });

            newState = selectDeck(newState, newState.decks[0]);

            return newState;
        case 'STANDALONE_DECKS_LOADED':
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }

            newState = Object.assign({}, state, {
                standaloneDecks: action.response.decks
            });

            return newState;
        case 'REQUEST_DECK':
            return Object.assign({}, state, {
                deckSaved: false,
                deckDeleted: false
            });
        case Decks.RequestDecks:
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

            if (!newState.decks.some((deck) => deck.id === parseInt(action.response.deck.id))) {
                newState.decks.push(processDecks([action.response.deck], state));
            }

            var selected = newState.decks.find((deck) => {
                return deck.id === parseInt(action.response.deck.id);
            });

            newState = selectDeck(newState, selected);

            return newState;
        case 'SELECT_DECK':
            newState = Object.assign({}, state, {
                selectedDeck: action.deck,
                deckSaved: false
            });

            if (newState.selectedDeck) {
                processDecks([newState.selectedDeck], state);
            }

            return newState;
        case Decks.SaveDeck:
            newState = Object.assign({}, state, {
                deckSaved: false
            });

            return newState;
        case Decks.DeckSaved:
            decks = state.decks;
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

            newState.decks = newState.decks.filter((deck) => {
                return deck.id !== parseInt(action.response.deckId);
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
