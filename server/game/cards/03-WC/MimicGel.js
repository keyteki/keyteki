const Card = require('../../Card.js');

class MimicGel extends Card {
    // Mimic Gel cannot be played unless there is another creature in play.
    // Mimic Gel enters play as a copy of another creature in play, except it belongs to house Logos.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.creaturesInPlay.length === 0,
            location: 'any',
            targetLocation: 'any',
            effect: ability.effects.cardCannot('play')
        });

        this.reaction({
            when: {
                onAbilityInitiated: (event, context) =>
                    event.context.source === context.source &&
                    event.context.ability.title === 'Play this creature'
            },
            location: 'any',
            target: {
                cardType: 'creature',
                gameAction: ability.actions.conditional((context) => {
                    const copiedCard = context.target.getBottomCard();
                    // Create a wrapper that overrides printedName but proxies everything else
                    const cardWrapper = Object.create(copiedCard);
                    Object.defineProperty(cardWrapper, 'printedName', {
                        value: `Mimic Gel as ${copiedCard.name}`,
                        enumerable: true
                    });
                    const customCopyEffect = ability.effects.copyCard(cardWrapper);

                    return {
                        condition:
                            !copiedCard.hasKeyword('alpha') || context.game.firstThingThisPhase(),
                        trueGameAction: ability.actions.cardLastingEffect({
                            target: context.source,
                            allowedLocations: 'any',
                            duration: 'lastingEffect',
                            effect: [customCopyEffect, ability.effects.changeHouse('logos')]
                        }),
                        falseGameAction: ability.actions.cardLastingEffect({
                            target: context.source,
                            allowedLocations: 'any',
                            duration: 'lastingEffect',
                            effect: [
                                customCopyEffect,
                                ability.effects.changeHouse('logos'),
                                ability.effects.creatureCardLocationAfterPlay('hand')
                            ]
                        })
                    };
                })
            },
            effect: 'copy {0}'
        });
    }
}

MimicGel.id = 'mimic-gel';

module.exports = MimicGel;
