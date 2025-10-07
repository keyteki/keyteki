import Card from '../../Card.js';

class GemcoatVendor extends Card {
    //Action: Steal 1A. Deal 1D to $this.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.sequential([
                ability.actions.steal(),
                ability.actions.dealDamage((context) => ({
                    target: context.source
                }))
            ]),
            effect: 'Steal 1 amber and deal 1 damage to {0}'
        });
    }
}

GemcoatVendor.id = 'gemcoat-vendor';

export default GemcoatVendor;
