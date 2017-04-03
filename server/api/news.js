const NewsRepository = require('../repositories/newsRepository.js');

let newsRepository = new NewsRepository();

module.exports.init = function(server) {
    server.get('/api/news', function(req, res) {
        let news = newsRepository.getNewsItems();

        res.send(news);
    });
};
