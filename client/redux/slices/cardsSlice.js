import _ from 'underscore';
import { createSlice } from '@reduxjs/toolkit';

import { api } from '../api';

const selectDeckInternal = (state, deck) => {
    if (state.decks && state.decks.length !== 0) {
        state.selectedDeck = deck;
    } else {
        delete state.selectedDeck;
    }
};

const normalizeDeck = (deck, state) => {
    if (!deck || !state.cards || !deck.houses || !deck.cards) {
        return { ...deck, status: deck?.status || {} };
    }

    const cards = deck.cards.map((card) => {
        const result = {
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

    if (cards.some((c) => c.enhancements && c.enhancements[0] === '')) {
        hasEnhancementsSet = false;
    }

    return {
        ...deck,
        cards,
        status: {
            basicRules: hasEnhancementsSet,
            flagged: !!deck.flagged,
            verified: !!deck.verified,
            usageLevel: deck.usageLevel,
            noUnreleasedCards: true,
            officialRole: true,
            extendedStatus: []
        }
    };
};

const normalizeDecks = (decks, state) => decks.map((deck) => normalizeDeck(deck, state));

const cardsSlice = createSlice({
    name: 'cards',
    initialState: { decks: [], cards: {} },
    reducers: {
        selectDeck: (state, action) => {
            const selected = state.decks?.find((deck) => deck.id === action.payload?.id);
            state.selectedDeck = selected || normalizeDeck(action.payload, state);
            state.deckSaved = false;
        },
        clearDeckStatus: (state) => {
            state.deckDeleted = false;
            state.deckSaved = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.getCards.matchFulfilled, (state, action) => {
                state.cards = action.payload.cards;
                if (state.decks.length > 0) {
                    state.decks = normalizeDecks(state.decks, state);
                }
                if (state.standaloneDecks?.length) {
                    state.standaloneDecks = normalizeDecks(state.standaloneDecks, state);
                }
                if (state.selectedDeck?.id) {
                    state.selectedDeck = state.decks.find(
                        (deck) => deck.id === state.selectedDeck.id
                    );
                }
            })
            .addMatcher(api.endpoints.getFactions.matchFulfilled, (state, action) => {
                const factions = {};
                for (const faction of action.payload.factions) {
                    factions[faction.value] = faction;
                }
                state.factions = factions;
            })
            .addMatcher(api.endpoints.getDecks.matchPending, (state) => {
                state.deckSaved = false;
                state.deckDeleted = false;
            })
            .addMatcher(api.endpoints.getDecks.matchFulfilled, (state, action) => {
                state.singleDeck = false;
                state.numDecks = action.payload.numDecks;
                state.decks = normalizeDecks(action.payload.decks, state);
                selectDeckInternal(state, state.decks[0]);
            })
            .addMatcher(api.endpoints.getStandaloneDecks.matchFulfilled, (state, action) => {
                if (action.payload.decks) {
                    state.standaloneDecks = normalizeDecks(action.payload.decks, state);
                } else {
                    state.standaloneDecks = action.payload.decks;
                }
            })
            .addMatcher(api.endpoints.getDeck.matchPending, (state) => {
                state.deckSaved = false;
                state.deckDeleted = false;
            })
            .addMatcher(api.endpoints.getDeck.matchFulfilled, (state, action) => {
                state.singleDeck = true;
                state.deckSaved = false;
                const deckId = parseInt(action.payload.deck.id);
                if (!state.decks.some((deck) => deck.id === deckId)) {
                    state.decks = [...state.decks, normalizeDeck(action.payload.deck, state)];
                }
                const selected = _.find(state.decks, (deck) => deck.id === deckId);
                selectDeckInternal(state, selected);
            })
            .addMatcher(api.endpoints.saveDeck.matchPending, (state) => {
                state.deckSaved = false;
            })
            .addMatcher(api.endpoints.saveDeck.matchFulfilled, (state, action) => {
                state.deckSaved = true;
                const normalized = normalizeDeck(action.payload.deck, state);
                state.selectedDeck = normalized;
                state.decks = [normalized, ...state.decks];
            })
            .addMatcher(api.endpoints.saveAllianceDeck.matchPending, (state) => {
                state.deckSaved = false;
            })
            .addMatcher(api.endpoints.saveAllianceDeck.matchFulfilled, (state) => {
                state.deckSaved = true;
            })
            .addMatcher(api.endpoints.deleteDeck.matchFulfilled, (state, action) => {
                state.deckDeleted = true;
                state.decks = state.decks.filter(
                    (deck) => deck.id !== parseInt(action.payload.deckId)
                );
                state.selectedDeck = state.decks[0];
            })
            .addMatcher(api.endpoints.refreshAccolades.matchFulfilled, (state, action) => {
                if (state.selectedDeck && action.payload && action.payload.success) {
                    state.selectedDeck.accolades = action.payload.accolades;
                    const deckIndex = state.decks.findIndex((d) => d.id === state.selectedDeck.id);
                    if (deckIndex !== -1) {
                        state.decks[deckIndex].accolades = action.payload.accolades;
                    }
                }
            })
            .addMatcher(api.endpoints.updateAccoladeShown.matchFulfilled, (state, action) => {
                const { accoladeId, shown } = action.meta.arg;
                if (!state.selectedDeck || !action.payload?.success || !accoladeId) {
                    return;
                }
                const accolade = state.selectedDeck.accolades?.find((a) => a.id === accoladeId);
                if (accolade) {
                    accolade.shown = shown;
                }
                const deckIndex = state.decks.findIndex((d) => d.id === state.selectedDeck.id);
                if (deckIndex !== -1) {
                    const deckAccolade = state.decks[deckIndex].accolades?.find(
                        (a) => a.id === accoladeId
                    );
                    if (deckAccolade) {
                        deckAccolade.shown = shown;
                    }
                }
            });
    }
});

export const cardsActions = cardsSlice.actions;
export default cardsSlice.reducer;
