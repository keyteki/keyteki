import Card from '../../Card.js';

class SacredDuty extends Card {
    // This creature gets +2 power and gains, “After Fight: Make a
    // token creature.”
    // Play: Ready this creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyPower(2),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.makeTokenCreature()
                })
            ]
        });

        this.play({
            gameAction: ability.actions.ready((context) => ({
                target: context.source.parent
            }))
        });
    }
}

SacredDuty.id = 'sacred-duty';

export default SacredDuty;
