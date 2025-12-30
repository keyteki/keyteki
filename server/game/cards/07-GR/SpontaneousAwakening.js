const Card = require('../../Card.js');

class SpontaneousAwakening extends Card {
    // Play: If your opponent is haunted, destroy an enemy artifact,
    // Cyborg creature, or Robot creature. If you do, play that card
    // as if it were in your hand. Attach Spontaneous Awakening to it
    // as an upgrade with the text, “This card belongs to house
    // Geistoid.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canAttachToArtifacts()
        });

        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.isHaunted(),
            target: {
                controller: 'opponent',
                cardCondition: (card) =>
                    card.type === 'artifact' ||
                    (card.type === 'creature' &&
                        (card.hasTrait('cyborg') || card.hasTrait('robot'))),
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.sequential([
                    ability.actions.playCard({
                        target: preThenContext.target
                    }),
                    ability.actions.attach((context) => ({
                        upgrade: context.source,
                        target: preThenContext.target
                    })),
                    // This must come after the `attach` so that card is
                    // already in the "play area" when we add its lasting
                    // effect.
                    ability.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        duration: 'lastingEffect',
                        effect: ability.effects.changeType('upgrade')
                    }))
                ])
            })
        });

        this.whileAttached({
            effect: ability.effects.changeHouse('geistoid')
        });
    }

    canAttach(card) {
        return (
            card &&
            (card.getType() === 'artifact' || card.getType() === 'creature') &&
            card.location === 'play area'
        );
    }
}

SpontaneousAwakening.id = 'spontaneous-awakening';

module.exports = SpontaneousAwakening;
