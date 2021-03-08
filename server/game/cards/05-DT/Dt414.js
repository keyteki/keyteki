const Card = require('../../Card.js');

class Dt414 extends Card {
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

Dt414.id = 'dt414';

module.exports = Dt414;
