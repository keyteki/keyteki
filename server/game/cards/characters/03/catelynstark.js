const DrawCard = require('../../../drawcard.js');

class CatelynStark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, player, card) => this.starkCharacterSacrificedOrKilled(event, player, card),
                onCharacterKilled: (event, player, card) => this.starkCharacterSacrificedOrKilled(event, player, card)
            },
            limit: ability.limit.perRound(2),
            handler: () => {
                this.game.addMessage('{0} gains 1 power on {1} in reaction to a {2} character being sacrificed or killed', this.controller, this, this.getFaction());
                this.modifyPower(1);
            }
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.power)
        });
    }

    starkCharacterSacrificedOrKilled(event, player, card) {
        return (
            this.controller === player &&
            card !== this &&
            card.getFaction() === this.getFaction() &&
            card.getType() === 'character'
        );
    }
}

CatelynStark.code = '03002';

module.exports = CatelynStark;
