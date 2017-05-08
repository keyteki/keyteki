const DrawCard = require('../../../drawcard.js');

class Ghost extends DrawCard {
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
                this.game.addMessage('{0} uses {1} to make {2} unable to be declared as a defender', this.controller, this, this.bypassed);
                this.untilEndOfPhase(ability => ({
                    match: this.bypassed,
                    effect: ability.effects.cannotBeDeclaredAsDefender()
                }));
            }
        });
    }
}

Ghost.code = '01123';

module.exports = Ghost;
