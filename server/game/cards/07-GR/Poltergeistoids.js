const Card = require('../../Card.js');

class Poltergeistoids extends Card {
    // Play: Purge a card from a discard pile. If you do, play a
    // creature or artifact from your purged zone as if it were in your hand.
    // Attach Poltergeistoids to it as an upgrade with the text, “This card
    // belongs to house Geistoid.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canAttachToArtifacts()
        });

        this.play({
            target: {
                controller: 'any',
                location: 'discard',
                gameAction: ability.actions.purge()
            },
            then: {
                target: {
                    controller: 'self',
                    cardType: ['creature', 'artifact'],
                    location: ['purged'],
                    gameAction: ability.actions.sequential([
                        ability.actions.playCard(),
                        ability.actions.attach((context) => ({
                            upgrade: context.source,
                            target: context.target
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
                }
            }
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

Poltergeistoids.id = 'poltergeistoids';

module.exports = Poltergeistoids;
