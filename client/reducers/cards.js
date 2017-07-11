import _ from 'underscore';
import validateDeck from '../deck-validator.js';

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
        if(!state.cards || !deck.faction) {
            deck.validation = {};
            return;
        }

        deck.faction = state.factions[deck.faction.value];
        if(deck.agenda) {
            deck.agenda = state.agendas[deck.agenda.code];
        }

        deck.plotCards = _.map(deck.plotCards, card => {
            return { count: card.count, card: state.cards[card.card.code] };
        });

        deck.drawCards = _.map(deck.drawCards, card => {
            return { count: card.count, card: state.cards[card.card.code] };
        });

        deck.validation = validateDeck(deck, state.packs);
    });
}

export default function(state = {}, action) {
    let newState;
    switch(action.type) {
        case 'RECEIVE_CARDS':
            var agendas = {};

            _.each(action.response.cards, card => {
                if(card.type_code === 'agenda' && card.pack_code !== 'VDS') {
                    agendas[card.code] = card;
                }
            });

            var banners = _.filter(agendas, card => {
                return card.label.startsWith('Banner of the');
            });

            return Object.assign({}, state, {
                cards: action.response.cards,
                agendas: agendas,
                banners: banners
            });
        case 'RECEIVE_PACKS':
            return Object.assign({}, state, {
                packs: action.response.packs
            });
        case 'RECEIVE_FACTIONS':
            var factions = {};

            _.each(action.response.factions, faction => {
                factions[faction.value] = faction;
            });

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

            if(newState.selectedDeck && !newState.selectedDeck._id) {
                if(_.size(newState.decks) > 0) {
                    newState.selectedDeck = newState.decks[0];
                }
            }
            
            return newState;
        case 'RECEIVE_DECK':
            newState = Object.assign({}, state, {
                singleDeck: true,
                deckSaved: false
            });

            processDecks([action.response.deck], state);

            newState.decks = _.map(state.decks, deck => {
                if(action.response.deck._id === deck.id) {
                    return deck;
                }

                return deck;
            });

            if(!_.any(newState.decks, deck => {
                return deck._id === action.response.deck._id;
            })) {
                newState.decks.push(action.response.deck);
            }

            var selected = _.find(newState.decks, deck => {
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
        case 'ADD_DECK':
            var newDeck = { name: 'New Deck' };
            
            newState = Object.assign({}, state, {
                selectedDeck: newDeck,
                deckSaved: false
            });

            processDecks([newState.selectedDeck], state);

            return newState;
        case 'UPDATE_DECK':
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
            newState = Object.assign({}, state, {
                deckSaved: true,
                decks: undefined
            });

            return newState;
        case 'DECK_DELETED':            
            newState = Object.assign({}, state, {
                deckDeleted: true
            });

            newState.decks = _.reject(newState.decks, deck => {
                return deck._id === action.response.deckId;
            });

            newState.selectedDeck = _.first(newState.decks);

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
