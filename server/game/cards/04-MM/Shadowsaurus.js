const Card = require('../../Card.js');

class Shadowsaurus extends Card {
    // Action: Move each A from an enemy creature to your opponents pool. If there was at least 1A on that creature, take control of it. While under your control, it belongs to house Shadows.
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
                        target: context.target.tokens.amber ? context.target : [],
                        effect: ability.effects.takeControl(context.player)
                    })),
                    ability.actions.cardLastingEffect((context) => ({
                        target: context.target.tokens.amber ? context.target : [],
                        duration: 'lastingEffect',
                        condition: (context) => context.target.controller === context.player,
                        effect: ability.effects.changeHouse('shadows')
                    }))
                ]
            }
        });
    }
}

Shadowsaurus.id = 'shadowsaurus';

module.exports = Shadowsaurus;
