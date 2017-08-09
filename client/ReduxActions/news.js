import $ from 'jquery';
import _ from 'underscore';

export function fetchNews() {
    return dispatch => {
        dispatch(requestNews());

        return $.ajax('/api/news')
            .done(function(data) {
                dispatch(receiveNews(data));
            });
    };
}

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
    return {
        types: ['REQUEST_NEWS', 'RECEIVE_NEWS'],
        shouldCallAPI: (state) => {
            return _.size(state.news.news) === 0 || (options && !!options.forceLoad);
        },
        callAPI: () => {
            let params = {};

            if(options && options.limit) {
                params.limit = options.limit;
            }

            return $.ajax('/api/news/', { cache: false, data: params });
        }
    };
}

export function addNews(newsText) {
    return {
        types: ['ADD_NEWS', 'NEWS_ADDED'],
        shouldCallAPI: (state) => {
            return state.news.news;
        },
        callAPI: () => $.ajax('/api/news', {
            type: 'PUT',
            data: { text: newsText }
        })
    };
}

export function clearNewsStatus() {
    return {
        type: 'CLEAR_NEWS_STATUS'
    };
}
