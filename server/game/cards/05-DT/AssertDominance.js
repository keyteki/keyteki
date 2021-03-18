const Card = require('../../Card.js');

class AssertDominance extends Card {
    //Play: For the remainder of the turn, a friendly creature gains Skirmish. Ready and fight with that creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.cardLastingEffect({
                    effect: ability.effects.addKeyword({
                        skirmish: 1
                    })
                }),
                ability.actions.sequential([ability.actions.ready(), ability.actions.fight()])
            ])
        });
    }
}

AssertDominance.id = 'assert-dominance';

module.exports = AssertDominance;
