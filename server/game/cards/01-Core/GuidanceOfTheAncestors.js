const DrawCard = require('../../drawcard.js');

class GuidanceOfTheAncestors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play this from the discard pile',
            location: 'conflict discard pile',
            gameAction: ability.actions.playCard()
        });
    }
}

GuidanceOfTheAncestors.id = 'guidance-of-the-ancestors';

module.exports = GuidanceOfTheAncestors;
