import Card from '../../Card.js';

class LaurelWreath extends Card {
    // This creature gets +1 power for each amber on it.
    // Play: Exalt this creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyPower((target) => target.amber || 0)
        });

        this.play({
            gameAction: ability.actions.exalt((context) => ({ target: context.source.parent }))
        });
    }
}

LaurelWreath.id = 'laurel-wreath';

export default LaurelWreath;
