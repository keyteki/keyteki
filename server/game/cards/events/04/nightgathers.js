const DrawCard = require('../../../drawcard.js');

class NightGathers extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Allow marshaling from opponent discard',
            phase: 'marshal',
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);
                if(!opponent) {
                    return;
                }

                this.game.addMessage('{0} plays {1} to allow cards from {2}\'s discard pile to be marshaled', this.controller, this, opponent);
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.canMarshalFrom(opponent, 'discard pile')
                }));

            }
        });
    }
}

NightGathers.code = '04046';

module.exports = NightGathers;
