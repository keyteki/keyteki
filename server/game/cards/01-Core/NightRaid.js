const ProvinceCard = require('../../provincecard.js');

class NightRaid extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard cards equal to the number of attackers',
            when: {
                onProvinceRevealed: (event, context) => event.province === context.source
            },
            gameAction: ability.actions.chosenDiscard(context => ({ amount: context.event.conflict.attackers.length }))
        });
    }
}

NightRaid.id = 'night-raid';

module.exports = NightRaid;
