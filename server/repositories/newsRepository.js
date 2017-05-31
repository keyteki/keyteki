const _ = require('underscore');

const news = require('ringteki-data').news;

class NewsRepository {
    getNewsItems() {
        return _.sortBy(news.news, 'datePublished').reverse();
    }
}

module.exports = NewsRepository;
