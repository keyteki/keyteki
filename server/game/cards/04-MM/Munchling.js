const Card = require('../../Card.js');

class Munchling extends Card {
    setupCardAbilities (ability) {
        this.fight({
            optional: true,
            select: {
                mode: 'select',
                activePromptTitle: 'Choose which to discard from hand or archives',
                choices: {
                    'discard': context => context.player.discard.length > 0,
                    'archives\'s': context => context.player.archives.length > 0
                }
            },
            cards: {
                dependsOn: 'select',
                mode: 'upTo',
                numCards: 1,
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.gainAmber(1)
            }
        });
    }
}

Munchling.id = 'munchling';

module.exports = Munchling;
