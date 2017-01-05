const DrawCard = require('../../../drawcard.js');
 
class VictarionGreyjoy extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onKillingCharacter']);
    }

    onKillingCharacter(event, player, card, allowSave) {
        if(!allowSave || player !== this.controller || card !== this || this.power < 2 || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Save ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'save' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use save effects'
        });

        event.cancel = true;
    }

    save(player) {
        this.power -= 2;

        this.game.addMessage('{0} uses {1} to save {2}', player, this, this);

        return true;
    }

    cancel(player) {
        player.killCharacter(this);

        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

VictarionGreyjoy.code = '05027';

module.exports = VictarionGreyjoy;
