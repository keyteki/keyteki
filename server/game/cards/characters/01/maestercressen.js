const DrawCard = require('../../../drawcard.js');

class MaesterCressen extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel to discard condition',
            phase: 'marshal',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.kneeled) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select an attachment to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'attachment' && card.hasTrait('condition'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        player.discardCard(card);

        player.kneelCard(this);

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, card);

        return true;
    }
}

MaesterCressen.code = '01046';

module.exports = MaesterCressen;
