import $ from 'jquery';

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
