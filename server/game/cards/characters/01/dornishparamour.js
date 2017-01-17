const DrawCard = require('../../../drawcard.js');

class DornishParamour extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onAttackersDeclared: (event, challenge) => challenge.isAttacking(this)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.controller !== this.controller && 
                        card.getType() === 'character' && !card.kneeled && !this.game.currentChallenge.isDefending(card),
                    onSelect: (p, card) => this.onCardSelected(p, card) && card.hasIcon(this.game.currentChallenge.challengeType)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.game.currentChallenge.addDefender(card);

        this.game.addMessage('{0} uses {1} to force {2} to be declared as a defender', this.controller, this, card);

        return true;
    }
}

DornishParamour.code = '01111';

module.exports = DornishParamour;
