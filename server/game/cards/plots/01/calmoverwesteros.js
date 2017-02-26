const PlotCard = require('../../../plotcard.js');

class CalmOverWesteros extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: [
                            { text: 'Military', method: 'setChallengeType', arg: 'military' },
                            { text: 'Intrigue', method: 'setChallengeType', arg: 'intrigue' },
                            { text: 'Power', method: 'setChallengeType', arg: 'power' },
                            { text: 'Cancel', method: 'cancelChallengeSelect' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    cancelChallengeSelect(player) {
        this.game.addMessage('{0} cancels the effect of {1}', player, this);
        return true;
    }

    setChallengeType(player, challengeType) {
        this.challengeType = challengeType;
        this.game.addMessage('{0} uses {1} to reduce the claim value of {2} challenges by 1 this round', player, this, challengeType);
        return true;
    }

    modifyClaim(player, challengeType, claim) {
        if(player === this.controller || this.challengeType !== challengeType) {
            return claim;
        }

        return claim - 1;
    }
}

CalmOverWesteros.code = '01008';

module.exports = CalmOverWesteros;
