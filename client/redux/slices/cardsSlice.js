// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit';
import { api } from './apiSlice';

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
        // Populate card reference data when RTK Query fulfills
        builder.addMatcher(api.endpoints.loadCards.matchFulfilled, (state, action) => {
            const decks = state.decks;
            state.cards = action.payload?.cards || action.payload || {};
            if (decks && decks.length > 0) {
                processDecks(decks, state);
                state.decks = decks;
            }
        });

        builder.addMatcher(api.endpoints.loadFactions.matchFulfilled, (state, action) => {
            const factionsArr = action.payload?.factions || action.payload || [];
            const factions = {};
            for (const faction of factionsArr) {
                factions[faction.value] = faction;
            }
            state.factions = factions;
        });
    }
});

export const { clearDeckStatus, selectDeckReducer } = cardsSlice.actions;
export default cardsSlice.reducer;
