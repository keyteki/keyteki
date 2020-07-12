const Card = require('../../Card.js');

class Shadowsaurus extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: "return all amber from {1} to {2}'s pool{3}{4}",
            effectArgs: (context) => [
                context.target,
                context.target.controller,
                context.target.tokens.amber ? ' and take control of ' : '',
                context.target.tokens.amber ? context.target : null
            ],
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: [
                    ability.actions.returnAmber((context) => ({
                        all: true,
                        recipient: context.target.controller
                    })),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        target: context.target.tokens.amber ? context.target : undefined,
                        effect: ability.effects.takeControl(context.player)
                    }))
                ]
            },
            then: (context) => ({
                condition: () =>
                    context.player.houses.every((house) => !context.target.hasHouse(house)),
                gameAction: ability.actions.cardLastingEffect({
                    target: context.target,
                    duration: 'lastingEffect',
                    until: {
                        onTakeControl: (event) =>
                            event.card === context.target &&
                            event.player === context.player.opponent
                    },
                    effect: ability.effects.changeHouse('shadows')
                })
            })
        });
    }
}

Shadowsaurus.id = 'shadowsaurus';

module.exports = Shadowsaurus;
