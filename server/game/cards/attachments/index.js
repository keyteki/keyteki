const loadCards = require('../../loader.js').loadCards;

var locations = loadCards('attachments', __dirname);

module.exports = locations;
