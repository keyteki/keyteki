const DrawCard = require('../../drawcard.js');

class BonsaiGarden extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 honor',
            condition: () => this.game.isDuringConflict('air'),
            gameAction: ability.actions.gainHonor()
        });
    }
}

BonsaiGarden.id = 'bonsai-garden';

module.exports = BonsaiGarden;
