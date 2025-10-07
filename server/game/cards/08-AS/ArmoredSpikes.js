import Card from '../../Card.js';

class ArmoredSpikes extends Card {
    // This creature gets +2 armor and gains hazardous 2.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyArmor(2), ability.effects.addKeyword({ hazardous: 2 })]
        });
    }
}

ArmoredSpikes.id = 'armored-spikes';

export default ArmoredSpikes;
