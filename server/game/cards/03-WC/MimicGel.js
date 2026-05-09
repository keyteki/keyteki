const Card = require('../../Card.js');
const { buildPlayAsCopyEffects } = require('../../helpers/playAsCopy.js');

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

        // Mimic Gel chooses a creature to copy as it enters play, regardless
        // of whether it was played or put into play by another effect. The
        // `onCardEnteringPlay` event fires before any positioning prompt
        // (e.g. flank choice), and before the card actually moves to the
        // play area, so the copy effect can land before the state check
        // that would otherwise destroy a 0-power Mimic Gel.
        this.reaction({
            when: {
                onCardEnteringPlay: (event, context) => event.card === context.source
            },
            location: 'any',
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    allowedLocations: 'any',
                    duration: 'lastingEffect',
                    effect: buildPlayAsCopyEffects({
                        context: context,
                        ability: ability,
                        additionalEffects: [ability.effects.changeHouse('logos')]
                    })
                }))
            },
            effect: 'copy {0}'
        });
    }
}

MimicGel.id = 'mimic-gel';

module.exports = MimicGel;
