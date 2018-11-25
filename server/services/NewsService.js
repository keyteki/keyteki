const logger = require('../log.js');

class NewsService {
    constructor(db) {
        this.news = db.get('news');
    }

    getRecentNewsItems(options) {
        var params = {};

        params.sort = { datePublished: -1 };
        if(options.limit) {
            params.limit = parseInt(options.limit);
        }

        return this.news.find({}, params);
    }

    addNews(news) {
        return this.news.insert(news)
            .then(result => {
                return result;
            })
            .catch(err => {
                logger.error('Error adding news item', err);

                throw new Error('Error occured adding news item');
            });
    }

    editNews(id, text) {
        return this.news.update({ _id: id }, { '$set': { text: text } })
            .then(() => {
                return true;
            })
            .catch(err => {
                logger.error('Error saving news item', err);

                throw new Error('Error occured saving news item');
            });
    }

    deleteNews(id) {
        return this.news.remove({ _id: id })
            .then(() => {
                return true;
            })
            .catch(err => {
                logger.error('Error deleting news item', err, id);

                throw new Error('Error occured deleting news item');
            });
    }
}

module.exports = NewsService;
