const Card = require('../../Card.js');

class Quadracorder extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(() => (['brobnar', 'dis', 'logos', 'mars', 'shadows', 'untamed', 'staralliance', 'sanctum', 'saurian'].filter(house => this.controller.creaturesInPlay.some(card => card.hasHouse(house))).length > 3) ? 3 : ['brobnar', 'dis', 'logos', 'mars', 'shadows', 'untamed', 'staralliance', 'sanctum', 'saurian'].filter(house => this.controller.creaturesInPlay.some(card => card.hasHouse(house))).length)
            })
        });
    }
}

Quadracorder.id = 'quadracorder';

module.exports = Quadracorder;
