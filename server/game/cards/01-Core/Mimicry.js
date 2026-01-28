const Card = require('../../Card.js');
const { buildCopyCardEffects } = require('../../helpers/copyCard.js');

class Mimicry extends Card {
    // When you play this card, treat it as a copy of an action card in your opponents discard pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onAbilityInitiated: (event, context) =>
                    event.context.source === context.source &&
                    event.context.ability.title === 'Play this action'
            },
            location: 'any',
            target: {
                cardType: 'action',
                controller: 'opponent',
                location: 'discard'
            },
            effect: 'to copy {0}',
            gameAction: ability.actions.cardLastingEffect((context) => ({
                allowedLocations: 'any',
                target: context.source,
                effect: buildCopyCardEffects({
                    copiedCard: context.target,
                    context: context,
                    ability: ability,
                    additionalEffects: []
                })
            }))
        });
    }
}

Mimicry.id = 'mimicry';

module.exports = Mimicry;
