const _ = require('underscore');

const news = require('eggteki-data').news;

class NewsRepository {
    getNewsItems() {
        return _.sortBy(news.news, 'datePublished').reverse();
    }
}

module.exports = NewsRepository;
