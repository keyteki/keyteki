const Card = require('../../Card.js');

class SloppyLabwork extends Card {
    // Play: Archive a card. Discard a card.
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
                    dependsOn: 'archive',
                    activePromptTitle: 'Choose a card to discard',
                    location: 'hand',
                    controller: 'self',
                    cardCondition: (card, context) => card !== context.targets.archive,
                    gameAction: ability.actions.discard()
                }
            },
            effect: 'archive a card{1}{2}',
            effectArgs: (context) =>
                context.targets.discard ? [' and discard ', context.targets.discard] : ['', '']
        });
    }
}

SloppyLabwork.id = 'sloppy-labwork';

module.exports = SloppyLabwork;
