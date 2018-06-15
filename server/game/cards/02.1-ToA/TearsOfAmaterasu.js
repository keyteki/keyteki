const ProvinceCard = require('../../provincecard.js');

class TearsOfAmaterasu extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain fate equal to the number of attackers',
            when: {
                onProvinceRevealed: (event, context) => event.province === context.source && event.conflict.attackers.length > 0
            },
            gameAction: ability.actions.gainFate(context => ({ amount: context.event.conflict.attackers.length }))
        });
    }
}

TearsOfAmaterasu.id = 'tears-of-amaterasu';

module.exports = TearsOfAmaterasu;
