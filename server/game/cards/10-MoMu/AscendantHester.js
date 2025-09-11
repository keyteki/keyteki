const GiganticCard = require('../../GiganticCard.js');

class AscendantHester extends GiganticCard {
    // (Play only with the other half of Ascendant Hester.)
    // Each other friendly creature gets +2 armor for each A on it.
    // Play/After Fight: Each friendly creature captures 1A.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            targetController: 'current',
            match: (card, context) => card !== context.source,
            effect: ability.effects.modifyArmor((target) => 2 * target.amber)
        });

        this.play({
            fight: true,
            gameAction: ability.actions.capture((context) => ({
                target: context.player.creaturesInPlay
            }))
        });
    }
}

AscendantHester.id = 'ascendant-hester';

module.exports = AscendantHester;
