const DrawCard = require('../../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onKillingCharacter: (event, player, card, allowSaves) => {
                    if(!allowSaves || card.getFaction() !== 'thenightswatch' || player !== card.controller || this.kneeled || this.triggered) {
                        return false;
                    }

                    this.toKill = card;
                    this.triggered = true;

                    event.cancel = true;

                    return true;
                }
            },
            handler: () => {
                this.game.addMessage('{0} kneels {1} to save {2}', this.controller, this, this.toKill);

                this.controller.kneelCard(this);

                this.triggered = false;
            },
            onCancel: () => {
                this.controller.killCharacter(this.toKill, false);

                this.triggered = false;

                return true;
            }
        });
    }
}

MaesterAemon.code = '01125';

module.exports = MaesterAemon;
