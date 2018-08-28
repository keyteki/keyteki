const Card = require('../../Card.js');

class HiddenStash extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'hand',
                gameAction: ability.actions.archive()
            }
        });
    }
}

HiddenStash.id = 'hidden-stash'; // This is a guess at what the id might be - please check it!!!

module.exports = HiddenStash;
