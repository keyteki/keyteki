const DrawCard = require('../../../drawcard.js');

class KingRobbsHost extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'military' &&
                    challenge.winner === this.controller &&
                    challenge.isParticipating(this) &&
                    challenge.loser.faction.power >= 1)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Choose an attacking character',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && this.game.currentChallenge.isAttacking(card),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(p, card) {
        var loser = this.game.currentChallenge.loser;

        if(loser.faction.power >= 2) {
            var power = this.game.anyPlotHasTrait('War') ? 2 : 1;
        } else {
            power = 1;
        }

        this.game.addPower(loser, -power);
        card.modifyPower(power);

        this.game.addMessage('{0} uses {1} to move {2} power from {3}\'s faction card to {4}', 
                              this.controller, this, power, loser, card);
                        
        return true;
    }
}

KingRobbsHost.code = '03001';

module.exports = KingRobbsHost;
