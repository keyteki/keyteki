const DrawCard = require('../../../drawcard.js');

class Shae extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Pay 1 gold to stand Shae',
            method: 'stand',
            phase: 'challenge',
            limit: ability.limit.perPhase(2)
        });
    }

    stand(player) {
        if(player.gold <= 0 || !this.kneeled) {
            return false;
        }

        this.game.addGold(this.controller, -1);
        player.standCard(this);

        this.game.addMessage('{0} pays 1 gold to stand {1}', this.controller, this);
    }
}

Shae.code = '04029';

module.exports = Shae;
