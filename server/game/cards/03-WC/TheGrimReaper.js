const Card = require('../../Card.js');

class TheGrimReaper extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.player.isHaunted(),
            effect: ability.effects.entersPlayReady()
        });

        this.reap({
            targets: {
                enemy: {
                    activePromptTitle: 'Choose an enemy creature to purge',
                    cardType: 'creature',
                    controller: 'opponent',
                    numCards: 1,
                    gameAction: ability.actions.purge()
                },
                friendly: {
                    activePromptTitle: 'Choose a friendly creature to purge',
                    cardType: 'creature',
                    controller: 'self',
                    numCards: 1,
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

TheGrimReaper.id = 'the-grim-reaper';

module.exports = TheGrimReaper;
