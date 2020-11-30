const Card = require('../../Card.js');

class PeaceAccord extends Card {
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
                onUseCard: (event) => event.fight && event.card.type === 'creature'
            },
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    target: context.event.card.controller,
                    amount: 4
                })),
                ability.actions.destroy()
            ]
        });
    }
}

PeaceAccord.id = 'peace-accord';

module.exports = PeaceAccord;
