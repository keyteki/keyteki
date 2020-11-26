import { News } from '../types';

function news(
    state = {
        news: []
    },
    action
) {
    let news = state.news;

    switch (action.type) {
        case News.RequestNews:
            return Object.assign({}, state, {});
        case News.NewsReceived:
            return Object.assign({}, state, {
                news: action.response.news
            });
        case News.AddNews:
            return Object.assign({}, state, {
                newsAdded: false
            });
        case News.NewsAdded:
            news.unshift(action.response.newsItem);

            return Object.assign({}, state, {
                newsAdded: true,
                news: news
            });
        case News.SaveNews:
            return Object.assign({}, state, {
                newsSaved: false
            });
        case News.NewsSaved:
            var matchingNews = news.find((n) => {
                return n.id === parseInt(action.response.id);
            });

            if (matchingNews) {
                matchingNews.text = action.response.text;
            }

            return Object.assign({}, state, {
                newsSaved: true,
                news: news
            });
        case News.DeleteNews:
            return Object.assign({}, state, {
                newsDeleted: false
            });
        case News.NewsDeleted:
            news = news.filter((n) => {
                return n.id !== parseInt(action.response.id);
            });

            return Object.assign({}, state, {
                newsDeleted: true,
                news: news
            });
        default:
            return state;
    }
}

export default news;
