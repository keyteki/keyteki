const Card = require('../../Card.js');

class TheBodySnatchers extends Card {
    // Play: For the remainder of the turn, each enemy creature gains,
    // “Destroyed: Fully heal this creature and give control of it to
    // your opponent instead.”
    setupCardAbilities(ability) {
        this.play({
            effect:
                "give each enemy creature 'Destroyed: Fully heal this creature and give control of it to your opponent instead' for the remainder of the turn",
            gameAction: ability.actions.untilEndOfPlayerTurn({
                targetController: 'opponent',
                match: (card) => card.type === 'creature',
                effect: ability.effects.gainAbility('destroyed', {
                    effect: 'heal all damage from {0} and give control to {1}',
                    effectArgs: (context) => context.source.controller.opponent,
                    gameAction: [
                        ability.actions.heal({ fully: true }),
                        ability.actions.changeEvent((context) => ({
                            event: context.event,
                            cancel: true,
                            postHandler: (context) => (context.source.moribund = false)
                        })),
                        ability.actions.cardLastingEffect((context) => ({
                            duration: 'lastingEffect',
                            effect: ability.effects.takeControl(context.source.controller.opponent)
                        }))
                    ]
                })
            })
        });
    }
}

TheBodySnatchers.id = 'the-body-snatchers';

module.exports = TheBodySnatchers;
