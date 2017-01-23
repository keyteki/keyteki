const DrawCard = require('../../../drawcard.js');

class VictarionGreyjoy extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card, allowSave) => (
                    allowSave &&
                    card === this &&
                    this.power >= 2
                )
            },
            canCancel: true,
            handler: (context) => {
                context.cancel();
                this.modifyPower(-2);

                this.game.addMessage('{0} uses {1} to save {2}', this.controller, this, this);
            }
        });
    }
}

VictarionGreyjoy.code = '05027';

module.exports = VictarionGreyjoy;
