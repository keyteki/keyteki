const NewsService = require('../repositories/newsService.js');
const logger = require('../log.js');
const config = require('../config.js');

let newsService = new NewsService({ dbPath: config.dbPath });

module.exports.init = function(server) {
    server.get('/api/news', function(req, res) {
        newsService.getRecentNewsItems({ limit: req.query.limit })
            .then(news => {
                res.send({ success: true, news: news });
            })
            .catch(err => {
                logger.error(err);

                res.send({ success: false, message: 'Error loading news' });
            });
    });

    server.put('/api/news', function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(!req.user.permissions || !req.user.permissions.canEditNews) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        newsService.addNews({ poster: req.user.username, text: req.body.text, datePublished: new Date() })
            .then(() => {
                res.send({ success: true });
            })
            .catch(err => {
                logger.error(err);

                res.send({ success: false, message: 'Error saving news item' });
            });
    });
};
