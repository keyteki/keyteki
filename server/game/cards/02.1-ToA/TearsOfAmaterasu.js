const ProvinceCard = require('../../provincecard.js');

class TearsOfAmaterasu extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onProvinceRevealed: event => event.province === this
            },
            handler: context => {
                let numberOfAttackers = context.event.conflict.attackers.length
                if numberOfAttackers > 0 {
                    this.game.addMessage('{0} uses {1} to gain {2} fate', this.controller, this, numberOfAttackers);
                    this.game.addFate(this.controller, numberOfAttackers);
                }
            }
        });
    }
}

TearsOfAmaterasu.id = 'tears-of-amaterasu';

module.exports = TearsOfAmaterasu;
