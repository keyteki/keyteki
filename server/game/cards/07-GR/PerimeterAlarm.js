const Card = require('../../Card.js');

class PerimeterAlarm extends Card {
    // Play: Use a friendly non-Star Alliance creature. If you are
    // haunted, archive Perimeter Alarm.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.exhausted && !card.hasHouse('staralliance'),
                gameAction: ability.actions.use()
            },
            message: '{0} uses {1} to use {2}{3}',
            messageArgs: (context) => [
                context.player,
                context.source,
                context.target ? context.target : 'nothing',
                context.player.isHaunted() ? ' and archive ' + context.source.name : ''
            ],
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isHaunted(),
                gameAction: ability.actions.archive((context) => ({
                    target: context.source
                }))
            }
        });
    }
}

PerimeterAlarm.id = 'perimeter-alarm';

module.exports = PerimeterAlarm;
