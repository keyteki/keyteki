const ProvinceCard = require('../../provincecard.js');

class AppealingToTheFortunes extends ProvinceCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            match: this,
            condition: () => this.controller.role.hasTrait('void'),
            effect: ability.effects.modifyProvinceStrength(2)
        });

        this.interrupt({
            title: 'Choose a character',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                cardType: 'character',
                controller: 'self',
                location: ['province', 'hand'],
                gameAction: ability.actions.putIntoPlay()
            }
        });
    }
}

AppealingToTheFortunes.id = 'appealing-to-the-fortunes';

module.exports = AppealingToTheFortunes;
