import { News } from '../types';

export function requestNews() {
    return {
        type: News.RequestNews
    };
}

export function receiveNews(news) {
    return {
        type: News.NewsReceived,
        news: news
    };
}

export function loadNews(options) {
    let params = {};

    if (options && options.limit) {
        params.limit = options.limit;
    }

    return {
        types: [News.RequestNews, News.NewsReceived],
        shouldCallAPI: (state) => {
            return state.news.news.length === 0 || (options && !!options.forceLoad);
        },
        APIParams: { url: '/api/news/', cache: false, data: params }
    };
}

export function addNews(newsText) {
    return {
        types: [News.AddNews, News.NewsAdded],
        shouldCallAPI: (state) => {
            return state.news.news;
        },
        APIParams: {
            url: '/api/news',
            type: 'POST',
            data: JSON.stringify({ text: newsText })
        }
    };
}

export function saveNews(id, text) {
    return {
        types: [News.SaveNews, News.NewsSaved],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/news/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ text: text })
        }
    };
}

export function deleteNews(id) {
    return {
        types: [News.DeleteNews, News.NewsDeleted],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/news/${id}`,
            type: 'DELETE'
        }
    };
}
