const Card = require('../../Card.js');

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
            gameAction: ability.actions.conditional((context) => ({
                condition:
                    context.target &&
                    context.target.hasKeyword('alpha') &&
                    !context.game.firstThingThisPhase(),
                trueGameAction: ability.actions.cardLastingEffect((context) => ({
                    allowedLocations: 'any',
                    target: context.source,
                    effect: ability.effects.actionCardLocationAfterPlay('hand')
                })),
                falseGameAction: ability.actions.cardLastingEffect((context) => {
                    let card = context.target;

                    let effects = [];
                    if (card) {
                        effects.push(ability.effects.modifyBonusIcons(card.bonusIcons));
                        if (card.hasKeyword('omega')) {
                            effects.push(ability.effects.addKeyword({ omega: 1 }));
                        }
                        effects = effects.concat(
                            card.abilities.reactions
                                .filter((ability) => ability.properties.name === 'Play')
                                .map((playAbility) =>
                                    ability.effects.gainAbility('play', playAbility.properties)
                                )
                        );
                    }

                    return {
                        // Since Mimicry could be played from hand, but also from
                        // top of deck by e.g. Wild Wormhole, we need to allow "any"
                        // for the location.
                        allowedLocations: 'any',
                        effect: effects
                    };
                })
            }))
        });
    }
}

Mimicry.id = 'mimicry';

module.exports = Mimicry;
