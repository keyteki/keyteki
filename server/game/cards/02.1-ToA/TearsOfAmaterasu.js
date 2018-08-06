const ProvinceCard = require('../../provincecard.js');

class TearsOfAmaterasu extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain fate equal to the number of attackers',
            when: {
                onProvinceRevealed: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.gainFate(() => ({
                amount: this.game.currentConflict ? this.game.currentConflict.getNumberOfParticipantsFor('attacker') : 0
            }))
        });
    }
}

TearsOfAmaterasu.id = 'tears-of-amaterasu';

module.exports = TearsOfAmaterasu;
