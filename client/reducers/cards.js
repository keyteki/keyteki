import _ from 'underscore';

function cards(state = {
    cards: []
}, action) {
    switch(action.type) {
        case 'REQUEST_CARDS':
            return Object.assign({}, state, {
            });
        case 'REQUEST_PACKS':
            return Object.assign({}, state, {
            });            
        case 'RECEIVE_CARDS':
            var agendas = _.filter(action.cards, function(card) {
                return card.type_code === 'agenda' && card.pack_code !== 'VDS';
            });
            return Object.assign({}, state, {
                cards: action.cards,
                agendas: agendas
            });
        case 'RECEIVE_PACKS':
            return Object.assign({}, state, {
                packs: action.packs
            });            
        default:
            return state;
    }
}

export default cards;
