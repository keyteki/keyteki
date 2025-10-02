const Card = require('../../Card.js');

class AnimatingForce extends Card {
    // This upgrade enters play attached to an artifact instead of a creature.
    //
    // Play: Take control of this artifact and put it on a flank of
    // your battleline as a creature with 4 power and versatile.
    //
    // Scrap: Gain 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canAttachToArtifacts()
        });

        this.play({
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.source.parent,
                duration: 'lastingEffect',
                effect: [
                    ability.effects.changeType('creature'),
                    ability.effects.modifyPower(4),
                    ability.effects.takeControl(context.player),
                    ability.effects.addKeyword({ versatile: 1 })
                ]
            })),
            then: {
                condition: (context) => context.preThenEvent.clone.controller === context.player,
                gameAction: ability.actions.moveToFlank((context) => ({
                    target: context.source.parent
                }))
            }
        });

        this.scrap({
            gameAction: ability.actions.gainAmber()
        });
    }

    canAttach(card) {
        return card && card.getType() === 'artifact' && card.location === 'play area';
    }
}

AnimatingForce.id = 'animating-force';

module.exports = AnimatingForce;
