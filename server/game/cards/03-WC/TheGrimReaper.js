const Card = require('../../Card.js');

class TheGrimReaper extends Card {
    // If you are haunted, The Grim Reaper enters play ready. (You are haunted if there are 10 or more cards in your discard pile.)
    // Reap: Purge an enemy creature and a friendly creature.
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
