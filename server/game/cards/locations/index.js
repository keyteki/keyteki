const loadCards = require('../../loader.js').loadCards;

var locations = loadCards('locations', __dirname);

module.exports = locations;
