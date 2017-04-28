const DrawCard = require('../../../drawcard.js');

class CatelynStark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, player, card) => this.starkCharacterSacrificedOrKilled(event, card),
                onCharacterKilled: event => this.starkCharacterSacrificedOrKilled(event, event.card)
            },
            limit: ability.limit.perRound(2),
            handler: () => {
                this.game.addMessage('{0} gains 1 power on {1} in reaction to a {2} character being sacrificed or killed', this.controller, this, 'stark');
                this.modifyPower(1);
            }
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.power)
        });
    }

    starkCharacterSacrificedOrKilled(event, card) {
        return (
            this.controller === card.controller &&
            card !== this &&
            card.isFaction('stark') &&
            card.getType() === 'character'
        );
    }
}

CatelynStark.code = '03002';

module.exports = CatelynStark;
