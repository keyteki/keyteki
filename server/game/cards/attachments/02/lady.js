const DrawCard = require('../../../drawcard.js');

class Lady extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Pay 1 gold to attach Lady to another character',
            method: 'reAttach'
        });
    }

    reAttach(player) {
        if(!this.parent || this.controller.gold < 1) {
            return false;
        }

        player.removeAttachment(this, false);
        player.promptForAttachment(this);

        player.gold -= 1;

        this.triggered = true;

        return true;
    }

    canAttach(player, card) {
        if(card.getFaction() !== this.getFaction()) {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        card.strengthModifier += 2;

        if(this.triggered) {
            if(card.name === 'Sansa Stark' && card.kneeled) {
                player.standCard(card);
            }

            this.triggered = false;
        }
    }

    leavesPlay() {
        this.parent.strengthModifier -= 2;
    }
}

Lady.code = '02004';

module.exports = Lady;
