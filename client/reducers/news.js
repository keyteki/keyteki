import _ from 'underscore';

function news(state = {
    news: []
}, action) {
    switch(action.type) {
        case 'REQUEST_NEWS':
            return Object.assign({}, state, {
                newsLoading: true
            });
        case 'RECEIVE_NEWS':
            return Object.assign({}, state, {
                news: action.news,
                newsLoading: false
            });
        default:
            return state;
    }
}

export default news;
