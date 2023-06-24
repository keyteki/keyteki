const Card = require('../../Card.js');

class HoplitesDory extends Card {
    // This creature gets +2 power for each exhausted creature to its left.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyPower((card) => {
                let i = card.controller.creaturesInPlay.indexOf(card);
                return (
                    2 *
                    card.controller.creaturesInPlay.slice(0, i).filter((card) => card.exhausted)
                        .length
                );
            })
        });
    }
}

HoplitesDory.id = 'hoplite-s-dory';

module.exports = HoplitesDory;
