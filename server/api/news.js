const passport = require('passport');

const NewsService = require('../services/NewsService.js');
const logger = require('../log.js');
const { wrapAsync } = require('../util.js');

let newsService = new NewsService();

module.exports.init = function (server) {
    server.get(
        '/api/news',
        wrapAsync(async function (req, res, next) {
            passport.authenticate(
                'jwt',
                { session: false },
                wrapAsync(async (err, user) => {
                    if (err) {
                        return next(err);
                    }

                    let limit = 3;
                    let isNewsAdmin = user && user.permissions && user.permissions.canEditNews;

                    if (req.query.limit && isNewsAdmin) {
                        limit = req.query.limit;
                    }

                    let news;
                    try {
                        news = await newsService.getRecentNewsItems({ limit: limit });
                    } catch (err) {
                        logger.error(err);

                        return res.send({ success: false, message: 'Error loading news' });
                    }

                    if (isNewsAdmin) {
                        return res.send({ success: true, news: news });
                    }

                    res.send({
                        success: true,
                        news: news.map((n) => ({ text: n.text, datePublished: n.datePublished }))
                    });
                })
            )(req, res, next);
        })
    );

    server.post(
        '/api/news',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canEditNews) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            let newsItem = await newsService.addNews({
                poster: req.user.id,
                text: req.body.text,
                datePublished: new Date()
            });
            newsItem.poster = req.user.username;

            res.send({ success: true, newsItem: newsItem });
        })
    );

    server.put(
        '/api/news/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canEditNews) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            await newsService.editNews(req.params.id, req.body.text);
            res.send({ success: true, id: req.params.id, text: req.body.text });
        })
    );

    server.delete(
        '/api/news/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canEditNews) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            await newsService.deleteNews(req.params.id);

            res.send({
                success: true,
                message: 'News item deleted successfully',
                id: req.params.id
            });
        })
    );
};
