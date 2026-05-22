const Card = require('../../Card.js');

class VestedHarold extends Card {
    // Scrap: Choose a friendly creature and an enemy creature. Put
    // each chosen creature into its owner's archives.
    setupCardAbilities(ability) {
        this.scrap({
            targets: {
                friendly: {
                    activePromptTitle: 'Choose a creature to archive',
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.putIntoArchives()
                },
                enemy: {
                    activePromptTitle: 'Choose a creature to archive',
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.putIntoArchives()
                }
            },
            effect: 'archive {1}',
            effectArgs: (context) => [Object.values(context.targets)]
        });
    }
}

VestedHarold.id = 'vĕsted-harŏld';

module.exports = VestedHarold;
