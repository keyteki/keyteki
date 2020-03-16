export default function(state = { selectedCards: []}, action) {
    switch(action.type) {
        case 'BUILDER_CREATE':
            return Object.assign({}, state, {});
        case 'BUILDER_ADD':
            return Object.assign({}, state, {
                //selectedCards: action.response.selectedCards
            })
    }

    return state;
}