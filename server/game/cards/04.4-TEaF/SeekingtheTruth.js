const ProvinceCard = require('../../provincecard.js');

class SeekingtheTruth extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            targetLocation: 'province',
            condition: () => this.controller.role.hasTrait('water'),
            effect: ability.effects.modifyProvinceStrength(2)
        });

        this.interrupt({
            title: 'Move a character home',
            when: {
                onBreakProvince: (event, context) => event.card === context.source && context.player.opponent
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.isDefending(),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

SeekingtheTruth.id = 'seeking-the-truth';

module.exports = SeekingtheTruth;
