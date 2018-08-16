const Card = require('../../Card.js');

class SampleCollection extends Card {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        // TODO: Needs a forEach action
    }
}

SampleCollection.id = 'sample-collection'; // This is a guess at what the id might be - please check it!!!

module.exports = SampleCollection;
