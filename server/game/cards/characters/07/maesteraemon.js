const ApplyClaim = require('../../../gamesteps/challenge/applyclaim.js');
const DrawCard = require('../../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'challenge' && !this.allChallengesInitiatedByOpponent()
            },
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                let buttons = [];

                if(otherPlayer.getNumberOfChallengesInitiatedByType('military') === 0) {
                    buttons.push({ text: 'Military', method: 'satisfyClaim', arg: 'military' });
                }
                if(otherPlayer.getNumberOfChallengesInitiatedByType('intrigue') === 0) {
                    buttons.push({ text: 'Intrigue', method: 'satisfyClaim', arg: 'intrigue' });
                }
                if(otherPlayer.getNumberOfChallengesInitiatedByType('power') === 0) {
                    buttons.push({ text: 'Power', method: 'satisfyClaim', arg: 'power' });
                }
                buttons.push({ text: 'Done', method: 'cancel' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    satisfyClaim(player, claimType) {
        let otherPlayer = this.game.getOtherPlayer(this.controller);
        let challenge = {
            winner: player,
            loser: otherPlayer,
            challengeType: claimType,
            claim: player.getClaim()
        };

        this.game.addMessage('{0} uses {1} to have {2} satisfy {3} claim',
                              player, this, otherPlayer, claimType);

        this.game.queueStep(new ApplyClaim(this.game, challenge));

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }

    allChallengesInitiatedByOpponent() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return true;
        }

        return (
            otherPlayer.getNumberOfChallengesInitiatedByType('military') > 0 &&
            otherPlayer.getNumberOfChallengesInitiatedByType('intrigue') > 0 &&
            otherPlayer.getNumberOfChallengesInitiatedByType('power') > 0
        );
    }
}

MaesterAemon.code = '07005';

module.exports = MaesterAemon;
