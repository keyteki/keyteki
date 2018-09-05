const Card = require('../../Card.js');

class Restringuntus extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.cardLastingEffect(context => ({
                duration: 'lastingEffect',
                effect: ability.effects.customDetachedCard({
                    apply: card => card.lastingEffect(ability => ({
                        targetController: 'opponent',
                        effect: ability.effects.stopHouseChoice(context.house)
                    })),
                    unapply: (card, context, effect) => card.removeEffectFromEngine(effect)
                })
            }))
        });
    }
}

Restringuntus.id = 'restringuntus'; // This is a guess at what the id might be - please check it!!!

module.exports = Restringuntus;
