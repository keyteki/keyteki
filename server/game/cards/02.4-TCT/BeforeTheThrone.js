const ProvinceCard = require('../../provincecard.js');

class BeforeTheThrone extends ProvinceCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Take 2 honor',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.takeHonor(2)
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

BeforeTheThrone.id = 'before-the-throne';

module.exports = BeforeTheThrone;
