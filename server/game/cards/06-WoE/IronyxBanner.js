import Card from '../../Card.js';

class IronyxBanner extends Card {
    // Play: Make a token creature.
    // Each friendly Ironyx creature gets +1 power and +1 armor.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.type === 'creature' && card.hasTrait('ironyx'),
            effect: [ability.effects.modifyArmor(1), ability.effects.modifyPower(1)]
        });
    }
}

IronyxBanner.id = 'ironyx-banner';

export default IronyxBanner;
