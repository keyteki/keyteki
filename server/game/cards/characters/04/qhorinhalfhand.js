const DrawCard = require('../../../drawcard.js');

class QhorinHalfhand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'military' &&
                    challenge.winner === this.controller &&
                    challenge.isParticipating(this)
                )
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to kill',
                    source: this,
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.getType() === 'character' && 
                        !card.isUnique() && 
                        card.getStrength() < this.getStrength() &&
                        card.controller !== this.controller),
                    gameAction: 'kill',
                    onSelect: (p, card) => {
                        card.controller.killCharacter(card);
                        this.game.addMessage('{0} uses {1} to kill {2}', this.controller, this, card);
                        
                        return true;
                    }
                });
            }
        });
    }
}

QhorinHalfhand.code = '04105';

module.exports = QhorinHalfhand;
