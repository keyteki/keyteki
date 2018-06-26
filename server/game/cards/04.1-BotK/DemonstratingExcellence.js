const ProvinceCard = require('../../provincecard.js');

class DemonstratingExcellence extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            targetLocation: 'province',
            condition: () => this.controller.role.hasTrait('air'),
            effect: ability.effects.modifyProvinceStrength(2)
        });

        this.interrupt({
            title: 'Gain 1 fate and draw 1 card',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            gameAction: [
                ability.actions.gainFate(),
                ability.actions.draw()
            ]
        });
    }
}

DemonstratingExcellence.id = 'demonstrating-excellence';

module.exports = DemonstratingExcellence;
