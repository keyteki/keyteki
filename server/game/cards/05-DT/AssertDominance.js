import Card from '../../Card.js';

class AssertDominance extends Card {
    // Play: For the remainder of the turn, a friendly creature gains skirmish. Ready and fight with that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.cardLastingEffect({
                        effect: ability.effects.addKeyword({
                            skirmish: 1
                        })
                    }),
                    ability.actions.sequential([ability.actions.ready(), ability.actions.fight()])
                ]),
                effect: 'give skirmish to {0}, then ready and fight with it'
            }
        });
    }
}

AssertDominance.id = 'assert-dominance';

export default AssertDominance;
