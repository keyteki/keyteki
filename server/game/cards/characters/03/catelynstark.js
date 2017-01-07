const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class CatelynStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.power = 0;
        this.lastPower = 0;
    }

    setupCardAbilities() {
        this.reaction({
            when: {
                onSacrificed: (event, player, card) => this.starkCharacterSacrificedOrKilled(event, player, card),
                onCharacterKilled: (event, player, card) => this.starkCharacterSacrificedOrKilled(event, player, card)
            },
            limit: AbilityLimit.perRound(2),
            handler: () => {
                this.game.addMessage('{0} gains 1 power on {1} in reaction to a {2} character being sacrificed or killed', this.controller, this, this.getFaction());
                this.modifyPower(1);
                this.updateStrength();
            }
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

    updateStrength() {
        if(this.isBlank()) {
            return;
        }

        this.strengthModifier -= this.lastPower;
        this.strengthModifier += this.power;

        this.lastPower = this.controller.faction.power;
    }
}

CatelynStark.code = '03002';

module.exports = CatelynStark;
