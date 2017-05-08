const DrawCard = require('../../../drawcard.js');

class TrystaneMartell extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => this.controller === challenge.loser && challenge.isParticipating(this)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.getType() === 'character' &&
                        card.getStrength() < this.getStrength()),
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} uses {1} to make {2} unable to be declared as a defender', player, this, card);
                        this.untilEndOfPhase(ability => ({
                            match: card,
                            effect: ability.effects.cannotBeDeclaredAsDefender()
                        }));

                        return true;
                    }
                });
            }
        });
    }
}

TrystaneMartell.code = '05029';

module.exports = TrystaneMartell;
