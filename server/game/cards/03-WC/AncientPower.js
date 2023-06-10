const Card = require('../../Card.js');

class AncientPower extends Card {
    // Play: Ward each friendly creature with A on it.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.ward((context) => ({
                target: context.player.creaturesInPlay.filter((card) => card.hasToken('amber'))
            })),
            effect: 'ward all friendly creatures with amber on it'
        });
    }
}

AncientPower.id = 'ancient-power';

module.exports = AncientPower;
