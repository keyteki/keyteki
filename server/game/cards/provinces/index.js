const loadCards = require('../../loader.js').loadCards;

var provinces = loadCards('provinces', __dirname);

module.exports = provinces;
