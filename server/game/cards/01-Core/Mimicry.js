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
                location: 'discard',
                cardCondition: (card, context) =>
                    context.game.firstThingThisPhase() || !card.hasKeyword('alpha')
            },
            effect: 'to copy {0}',
            gameAction: ability.actions.cardLastingEffect((context) => {
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
                    targetLocation: 'hand',
                    effect: effects
                };
            })
        });
    }
}

Mimicry.id = 'mimicry';

module.exports = Mimicry;
