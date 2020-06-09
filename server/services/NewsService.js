const logger = require('../log.js');
const db = require('../db');

class NewsService {
    async getRecentNewsItems(options) {
        let news;
        try {
            news = await db.query(
                'SELECT n.*, u."Username" AS "Poster" FROM "News" n JOIN "Users" u ON u."Id" = n."PosterId" ORDER BY "PostedDate" DESC LIMIT $1',
                [options.limit]
            );
        } catch (err) {
            logger.error('Failed to fetch news', err);

            throw new Error('Failed to fetch news');
        }

        return news.map(this.mapNews);
    }

    async addNews(news) {
        let ret;

        try {
            ret = await db.query(
                'INSERT INTO "News" ("Text", "PosterId", "PostedDate") VALUES ($1, $2, $3) RETURNING "Id"',
                [news.text, news.poster, new Date()]
            );
        } catch (err) {
            logger.error('Error adding news item', err);

            throw new Error('Error occured adding news item');
        }

        news.id = ret[0].Id;

        return news;
    }

    async editNews(id, text) {
        try {
            await db.query('UPDATE "News" SET "Text" = $1 WHERE "Id" = $2', [text, id]);
        } catch (err) {
            logger.error('Error saving news item', err);

            throw new Error('Error occured saving news item');
        }
    }

    async deleteNews(id) {
        try {
            await db.query('DELETE FROM "News" WHERE "Id" = $1', [id]);
        } catch (err) {
            logger.error('Error deleting news item', err);

            throw new Error('Error occured deleting news item');
        }
    }

    mapNews(news) {
        return {
            id: news.Id,
            datePublished: news.PostedDate,
            poster: news.Poster,
            text: news.Text
        };
    }
}

module.exports = NewsService;
