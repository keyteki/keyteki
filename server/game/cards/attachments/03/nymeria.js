const DrawCard = require('../../../drawcard.js');

class Nymeria extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('Intimidate')
        });
        this.action({
            title: 'Pay 1 gold to attach Nymeria to another character',
            method: 'reAttach',
            limit: ability.limit.perPhase(1)
        });
    }

    reAttach(player) {
        if(!this.parent || this.controller.gold < 1) {
            return false;
        }

        player.removeAttachment(this, false);
        player.promptForAttachment(this);

        player.gold -= 1;
        this.game.addMessage('{0} pays 1 gold to attach {1} to {2}', player, this, this.parent);

        return true;
    }

    canAttach(player, card) {
        if(card.getFaction() !== this.getFaction() || card.getType() !== 'character' || !card.isUnique()) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Nymeria.code = '03019';

module.exports = Nymeria;
