const loadCards = require('../../loader.js').loadCards;

var attachments = loadCards('attachments', __dirname);

module.exports = attachments;
