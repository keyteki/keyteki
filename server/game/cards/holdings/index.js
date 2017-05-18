const loadCards = require('../../loader.js').loadCards;

var holdings = loadCards('holdings', __dirname);

module.exports = holdings;
