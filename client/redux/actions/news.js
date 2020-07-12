export function requestNews() {
    return {
        type: 'REQUEST_NEWS'
    };
}

export function receiveNews(news) {
    return {
        type: 'RECEIVE_NEWS',
        news: news
    };
}

export function loadNews(options) {
    let params = {};

    if (options && options.limit) {
        params.limit = options.limit;
    }

    return {
        types: ['REQUEST_NEWS', 'RECEIVE_NEWS'],
        shouldCallAPI: (state) => {
            return state.news.news.length === 0 || (options && !!options.forceLoad);
        },
        APIParams: { url: '/api/news/', cache: false, data: params }
    };
}

export function addNews(newsText) {
    return {
        types: ['ADD_NEWS', 'NEWS_ADDED'],
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
        types: ['SAVE_NEWS', 'NEWS_SAVED'],
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
        types: ['DELETE_NEWS', 'NEWS_DELETED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/news/${id}`,
            type: 'DELETE'
        }
    };
}

export function clearNewsStatus() {
    return {
        type: 'CLEAR_NEWS_STATUS'
    };
}
