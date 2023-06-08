const Card = require('../../Card.js');

class SelfBolsteringAutomata extends Card {
    // Destroyed: If you have any other creatures in play, instead of destroying Self-Bolstering Automata, fully heal it, exhaust it, and move it to a flank. If you do, give it two +1 power counters.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            effect: 'heal all damage from {0}, exhaust it and move it to a flank',
            effectArgs: () => this,
            gameAction: [
                ability.actions.heal({ fully: true }),
                ability.actions.exhaust(),
                ability.actions.moveToFlank(),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true,
                    postHandler: (context) => (context.source.moribund = false)
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event.triggeringEvent,
                    cancel: true
                }))
            ],
            then: (context) => ({
                gameAction: ability.actions.addPowerCounter({ target: context.source, amount: 2 })
            })
        });
    }
}

SelfBolsteringAutomata.id = 'self-bolstering-automata';

module.exports = SelfBolsteringAutomata;
