const loadCards = require('../../loader.js').loadCards;

var locations = loadCards('characters', __dirname);

module.exports = locations;
