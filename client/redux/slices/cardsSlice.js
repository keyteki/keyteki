// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit';
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
    for (let deck of decks || []) {
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
                prophecyId: card.prophecyId,
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

const initialState = { decks: [], cards: {} };

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        clearDeckStatus(state) {
            state.deckDeleted = false;
            state.deckSaved = false;
        },
        selectDeckReducer(state, action) {
            state.selectedDeck = action.payload;
            if (state.selectedDeck) {
                processDecks([state.selectedDeck], state);
            }
        }
    },
    extraReducers: (builder) => {
        // Legacy API-middleware action types the app still dispatches
        builder.addCase('RECEIVE_CARDS', (state, action) => {
            const decks = state.decks;
            state.cards = action.response.cards;
            if (decks.length > 0) {
                processDecks(decks, state);
                state.decks = decks;
            }
        });

        builder.addCase('RECEIVE_FACTIONS', (state, action) => {
            const factions = {};
            for (const faction of action.response.factions) {
                factions[faction.value] = faction;
            }
            state.factions = factions;
        });

        builder.addCase(Decks.DecksReceived, (state, action) => {
            processDecks(action.response.decks, state);
            state.singleDeck = false;
            state.numDecks = action.response.numDecks;
            state.decks = action.response.decks;
            selectDeck(state, state.decks[0]);
        });

        builder.addCase('STANDALONE_DECKS_LOADED', (state, action) => {
            if (action.response.decks) {
                processDecks(action.response.decks, state);
            }
            state.standaloneDecks = action.response.decks;
        });

        builder.addCase('REQUEST_DECK', (state) => {
            state.deckSaved = false;
            state.deckDeleted = false;
        });

        builder.addCase(Decks.RequestDecks, (state) => {
            state.deckSaved = false;
            state.deckDeleted = false;
        });

        builder.addCase('RECEIVE_DECK', (state, action) => {
            state.singleDeck = true;
            state.deckSaved = false;
            const exists = state.decks.some((d) => d.id === parseInt(action.response.deck.id));
            if (!exists) {
                processDecks([action.response.deck], state);
                state.decks.push(action.response.deck);
            }
            const selected = state.decks.find((d) => d.id === parseInt(action.response.deck.id));
            selectDeck(state, selected);
        });

        builder.addCase('SELECT_DECK', (state, action) => {
            state.selectedDeck = action.deck;
            state.deckSaved = false;
            if (state.selectedDeck) {
                processDecks([state.selectedDeck], state);
            }
        });

        builder.addCase(Decks.SaveDeck, (state) => {
            state.deckSaved = false;
        });

        builder.addCase(Decks.DeckSaved, (state, action) => {
            const decks = state.decks.slice();
            decks.unshift(action.response.deck);
            state.deckSaved = true;
            state.selectedDeck = action.response.deck;
            state.decks = decks;
            processDecks(state.decks, state);
        });

        builder.addCase('DECK_DELETED', (state, action) => {
            state.deckDeleted = true;
            state.decks = state.decks.filter((d) => d.id !== parseInt(action.response.deckId));
            state.selectedDeck = state.decks[0];
        });

        builder.addCase('CLEAR_DECK_STATUS', (state) => {
            state.deckDeleted = false;
            state.deckSaved = false;
        });
    }
});

export const { clearDeckStatus, selectDeckReducer } = cardsSlice.actions;
export default cardsSlice.reducer;
