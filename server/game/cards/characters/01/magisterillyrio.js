const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class MagisterIllyrio extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Pay 2 gold to stand a character',
            method: 'stand',
            limit: AbilityLimit.perPhase(1)
        });
    }

    stand(player) {
        if(this.controller !== player || player.gold < 2) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to stand',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character',
            onSelect: (p, card) => this.onStandSelected(p, card)
        });        

        return true;
    }

    onStandSelected(player, card) {
        this.game.addMessage('{0} uses {1} to pay 2 gold and stand {2}', player, this, card);

        player.standCard(card);
        player.gold -= 2;

        return true;
    }
}

MagisterIllyrio.code = '01163';

module.exports = MagisterIllyrio;
