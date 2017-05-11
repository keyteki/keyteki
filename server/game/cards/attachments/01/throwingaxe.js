const DrawCard = require('../../../drawcard.js');

class ThrowingAxe extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isAttacking(this.parent)
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to kill',
                    source: this,
                    cardCondition: card => card.location === 'play area' && this.game.currentChallenge.isDefending(card),
                    gameAction: 'kill',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.sacrificeCard(this);

        card.controller.killCharacter(card);

        this.game.addMessage('{0} sacrifices {1} to kill {2}', player, this, card);

        return true;
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('ironborn')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

ThrowingAxe.code = '01077';

module.exports = ThrowingAxe;
