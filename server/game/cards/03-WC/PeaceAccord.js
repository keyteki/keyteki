const Card = require('../../Card.js');

class PeaceAccord extends Card {
    // Play: Each player gains 2A.
    // After a player fights with a creature, they lose 4A. Destroy Peace Accord.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    target: context.player.opponent,
                    amount: 2
                })),
                ability.actions.gainAmber((context) => ({
                    target: context.player,
                    amount: 2
                }))
            ]
        });

        this.reaction({
            when: {
                onUseCard: (event) =>
                    event.fightEvent && event.fightEvent.attackerClone.type === 'creature'
            },
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    target: context.event.clone.controller,
                    amount: 4
                })),
                ability.actions.destroy()
            ]
        });
    }
}

PeaceAccord.id = 'peace-accord';

module.exports = PeaceAccord;
