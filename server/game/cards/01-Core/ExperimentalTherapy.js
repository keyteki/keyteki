const Card = require('../../Card.js');

class ExperimentalTherapy extends Card {
    // This creature belongs to all houses.
    // Play: Stun and exhaust this creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                effect: ability.effects.canUse((card) => card === this.parent)
            })
        });
        this.play({
            gameAction: [
                ability.actions.exhaust((context) => ({ target: context.source.parent })),
                ability.actions.stun((context) => ({ target: context.source.parent }))
            ]
        });
    }
}

ExperimentalTherapy.id = 'experimental-therapy';

module.exports = ExperimentalTherapy;
