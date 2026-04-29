const Card = require('../../Card.js');

class EclecticAmbrosiusEvilTwin extends Card {
    // Reap: Put an ignorance counter on an enemy creature. As long as that creature has an ignorance counter, its text box is considered blank (except for traits).
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                // This pattern matches Vial of Mutation and Revo Hooligans: add
                // a counter and an ability that responds to the counter being
                // there. See those cards for in-depth counter testing w/ Flying
                // Broomstick and Envoy of Ekwirrĕ.
                gameAction: ability.actions.sequential([
                    ability.actions.addIgnoranceCounter(),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        target: context.target,
                        condition: (ctx, event) =>
                            // event’s match will be the affected card, due to
                            // CardLastingEffectAction.
                            event.match.type === 'creature' && event.match.hasToken('ignorance'),
                        effect: ability.effects.blank()
                    }))
                ])
            },
            effect: 'put an ignorance counter on {0}, making its text box blank (except for traits)'
        });
    }
}

EclecticAmbrosiusEvilTwin.id = 'eclectic-ambrosius-evil-twin';

module.exports = EclecticAmbrosiusEvilTwin;
