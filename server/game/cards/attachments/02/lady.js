const DrawCard = require('../../../drawcard.js');

class Lady extends DrawCard {

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.action({
            title: 'Pay 1 gold to attach Lady to another character',
            method: 'reAttach',
            limit: ability.limit.perPhase(1)
        });
    }

    reAttach(player) {
        this.oldOwner = this.parent;
        if(!this.oldOwner || this.controller.gold < 1) {
            return false;
        }

        player.moveCard(this, 'play area');

        this.game.promptForSelect(this.controller, {
            cardCondition: card => this.canAttach(player, card) && card.location === 'play area',
            activePromptTitle: 'Select a different character for attachment',
            waitingPromptTitle: 'Waiting for opponent to move attachment',
            onSelect: (player, card) => this.moveAttachment(player, card)
        });

        return true;
    }

    canAttach(player, card) {
        if(!card.isFaction('stark') || card.getType() !== 'character' || card === this.oldOwner) {
            return false;
        }

        return super.canAttach(player, card);
    }

    moveAttachment(player, newOwner) {
        var targetPlayer = this.game.getPlayerByName(newOwner.controller.name);
        targetPlayer.attach(player, this, newOwner.uuid);
        player.gold -= 1;
        if(newOwner.name === 'Sansa Stark' && newOwner.kneeled) {
            player.standCard(newOwner);
            this.game.addMessage('{0} pays 1 gold to attach {1} from {2} to {3} and then stands {3}', player, this, this.oldOwner, newOwner);
        } else {
            this.game.addMessage('{0} pays 1 gold to attach {1} from {2} to {3}', player, this, this.oldOwner, newOwner);
        }
        this.oldOwner = null;

        return true;
    }
}

Lady.code = '02004';

module.exports = Lady;
