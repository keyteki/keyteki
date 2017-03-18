const DrawCard = require('../../../drawcard.js');

class DolorousEdd extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add as a defender',
            location: 'hand',
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'intrigue' &&
                this.game.currentChallenge.defendingPlayer === this.controller
            ),
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.addMessage('{0} kneels their faction card to put {1} into play as a defender', this.controller, this);
                this.controller.putIntoPlay(this);
                // Manually kneel Edd, since he enters play that way - should not fire a kneeling event.
                this.kneeled = true;
                this.game.currentChallenge.addDefender(this);
                this.game.once('afterChallenge:interrupt', (event, challenge) => this.promptOnWin(challenge));
            }
        });
    }

    promptOnWin(challenge) {
        if(challenge.winner !== this.controller) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Return ' + this.name + ' to your hand?',
                buttons: [
                    { text: 'Yes', method: 'returnToHand' },
                    { text: 'No', method: 'cancelReturnToHand' }
                ]
            }
        });
    }

    returnToHand() {
        this.game.addMessage('{0} chooses to return {1} to their hand after winning the challenge', this.controller, this);
        this.controller.returnCardToHand(this, false);
        return true;
    }

    cancelReturnToHand() {
        this.game.addMessage('{0} declines to return {1} to their hand', this.controller, this);
        return true;
    }
}

DolorousEdd.code = '04025';

module.exports = DolorousEdd;
