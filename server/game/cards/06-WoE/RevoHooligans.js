const Card = require('../../Card.js');

class RevoHooligans extends Card {
    // After Reap: Put a paint counter on an artifact. While that
    // artifact has a paint counter, it belongs to house Mars (instead
    // of its other houses).
    setupCardAbilities(ability) {
        this.reap({
            effect: 'put a paint counter on {0}, making it belong to house Mars',
            target: {
                cardType: 'artifact',
                gameAction: [
                    ability.actions.addPaintCounter(),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        target: context.target,
                        condition: (ctx, event) =>
                            // event’s match will be the affected card, due to
                            // CardLastingEffectAction.
                            event.match.type === 'artifact' && event.match.hasToken('paint'),
                        effect: ability.effects.changeHouse('mars')
                    }))
                ]
            }
        });
    }
}

RevoHooligans.id = 'revo-hooligans';

module.exports = RevoHooligans;
