const InsightKeyword = require('./insightkeyword.js');
const IntimidateKeyword = require('./intimidatekeyword.js');
const PillageKeyword = require('./pillagekeyword.js');
const RenownKeyword = require('./renownkeyword.js');

const GameKeywords = {
    'insight': new InsightKeyword(),
    'intimidate': new IntimidateKeyword(),
    'pillage': new PillageKeyword(),
    'renown': new RenownKeyword()
};

module.exports = GameKeywords;
