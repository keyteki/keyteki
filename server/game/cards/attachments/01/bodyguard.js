const DrawCard = require('../../../drawcard.js');
 
class BodyGuard extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCharacterKilled']);
    }

    canAttach(player, card) {
        if(!card.hasTrait('Lady') && !card.hasTrait('Lord')) {
            return false;
        }

        return super.canAttach(player, card);
    }

    onCharacterKilled(event, player, card, allowSave) {
        if(!this.inPlay || this.parent !== card || !allowSave) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Use ' + this.name + ' to save ' + card.name + '?',
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
        this.game.addMessage('{0} uses {1} to save {2}', player, this, this.parent);

        this.controller.sacrificeCard(this);

        return true;
    }

    cancel(player) {
        player.killCharacter(this.parent);

        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

BodyGuard.code = '01033';

module.exports = BodyGuard;
