const DrawCard = require('../../../drawcard.js');

class Lady extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
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
        if(this.triggered) {
            if(card.name === 'Sansa Stark' && card.kneeled) {
                player.standCard(card);
            }

            this.triggered = false;
        }
    }
}

Lady.code = '02004';

module.exports = Lady;
