const Card = require('../../Card.js');

class SloppyLabwork extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                archive: {
                    activePromptTitle: 'Choose a card to archive',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.archive()
                },
                discard: {
                    activePromptTitle: 'Choose a card to discard',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.discard()
                }
            },
            effect: 'archive a card and discard {1}',
            effectArgs: context => context.targets.discard
        });
    }
}

SloppyLabwork.id = 'sloppy-labwork'; // This is a guess at what the id might be - please check it!!!

module.exports = SloppyLabwork;
