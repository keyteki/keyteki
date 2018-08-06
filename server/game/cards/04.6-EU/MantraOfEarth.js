const DrawCard = require('../../drawcard.js');

class MantraOfEarth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Make a monk untargetable by opponents\' card effects and draw a card',
            when: {
                onConflictDeclared: (event, context) => event.ring.hasElement('earth') && event.conflict.attackingPlayer === context.player.opponent
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.hasTrait('monk') || card.attachments.any(card => card.hasTrait('monk')),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.cardCannot({
                        cannot: 'target',
                        restricts: 'opponentsCardEffects',
                        player: context.player
                    })
                }))
            },
            effect: 'make {0} untargetable by opponents\' card effects and draw a card',
            gameAction: ability.actions.draw()
        });
    }
}

MantraOfEarth.id = 'mantra-of-earth';

module.exports = MantraOfEarth;
