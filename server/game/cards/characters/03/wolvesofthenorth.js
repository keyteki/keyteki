const DrawCard = require('../../../drawcard.js');

class WolvesOfTheNorth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event, challenge, source, target) => {
                    if(source !== this) {
                        return false;
                    }

                    this.bypassed = target;

                    return true;
                }
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to give {2} a penalty to STR', this.controller, this, this.bypassed);
                this.untilEndOfPhase(ability => ({
                    match: this.bypassed,
                    effect: ability.effects.dynamicStrength(() => -this.controller.getNumberOfCardsInPlay(c => c.hasTrait('Direwolf')))
                }));
            }
        });
    }
}

WolvesOfTheNorth.code = '03006';

module.exports = WolvesOfTheNorth;
