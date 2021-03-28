const Card = require('../../Card.js');

class TheGrimReaper extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => {
                    return event.card === context.source && context.player.isHaunted();
                }
            },
            gameAction: ability.actions.ready()
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
