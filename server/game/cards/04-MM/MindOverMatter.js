const Card = require('../../Card.js');

class MindOverMatter extends Card {
    // Play: Put each creature into its owner's archives.
    setupCardAbilities(ability) {
        this.play({
            effect: 'archive all creatures',
            gameAction: ability.actions.putIntoArchives((context) => ({
                target: context.game.creaturesInPlay
            }))
        });
    }
}

MindOverMatter.id = 'mind-over-matter';

module.exports = MindOverMatter;
