const DrawCard = require('../../../drawcard.js');

class WildlingScout extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice this character to give another character stealth',
            method: 'sacrifice',
            limit: { amount: 1, period: 'phase' }
        });
    }    

    sacrifice(player) {
        if(this.location !== 'play area') {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to gain stealth',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area';
    }

    onCardSelected(player, card) {
        player.sacrificeCard(this);

        card.addKeyword('Stealth');
        this.modifiedCard = card;

        this.game.addMessage('{0} sacrifices {1} to make {2} gain stealth', player, this, card);

        this.game.once('onPhaseEnded', () => {
            this.onPhaseEnded();
        });

        return true;
    }

    onPhaseEnded() {
        if(this.modifiedCard) {
            this.modifiedCard.removeKeyword('Stealth');

            this.modifiedCard = undefined;
        }
    }   
}

WildlingScout.code = '02078';

module.exports = WildlingScout;
