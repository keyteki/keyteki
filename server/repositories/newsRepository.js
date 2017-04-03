const _ = require('underscore');

const news = require('throneteki-data').news;

class NewsRepository {
    getNewsItems() {
        return _.sortBy(news.news, 'datePublished').reverse();
    }
}

module.exports = NewsRepository;
