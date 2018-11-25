function news(state = {
    news: []
}, action) {
    let news = state.news;

    switch(action.type) {
        case 'REQUEST_NEWS':
            return Object.assign({}, state, {
            });
        case 'RECEIVE_NEWS':
            return Object.assign({}, state, {
                news: action.response.news
            });
        case 'ADD_NEWS':
            return Object.assign({}, state, {
                newsAdded: false
            });
        case 'NEWS_ADDED':
            news.unshift(action.response.newsItem);

            return Object.assign({}, state, {
                newsAdded: true,
                news: news
            });
        case 'SAVE_NEWS':
            return Object.assign({}, state, {
                newsSaved: false
            });
        case 'NEWS_SAVED':
            var matchingNews = news.find(n => {
                return n._id === action.response.id;
            });

            if(matchingNews) {
                matchingNews.text = action.response.text;
            }

            return Object.assign({}, state, {
                newsSaved: true,
                news: news
            });
        case 'DELETE_NEWS':
            return Object.assign({}, state, {
                newsDeleted: false
            });
        case 'NEWS_DELETED':
            news = news.filter(n => {
                return n._id !== action.response.id;
            });

            return Object.assign({}, state, {
                newsDeleted: true,
                news: news
            });
        case 'CLEAR_NEWS_STATUS':
            return Object.assign({}, state, {
                newsAdded: false,
                newsSaved: false,
                newsDeleted: false
            });
        default:
            return state;
    }
}

export default news;
