const DrawCard = require('../../drawcard.js');

class WrathOfTheKami extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add Province Strength',
            condition: context => this.game.isDuringConflict() && this.game.currentConflict.conflictProvince.location === context.source.location,
            cost: ability.costs.payHonor(1),
            limit: ability.limit.unlimitedPerConflict(),
            effect: 'add 1 to the province strength',
            gameAction: ability.actions.cardLastingEffect(() => ({
                target: this.game.currentConflict.conflictProvince,
                targetLocation: 'province',
                effect: ability.effects.modifyProvinceStrength(1)
            }))
        });
    }
}

WrathOfTheKami.id = 'the-wrath-of-the-kami';

module.exports = WrathOfTheKami;
