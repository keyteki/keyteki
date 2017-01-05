const DrawCard = require('../../../drawcard.js');

class TheRedKeep extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared', 'onDefendersDeclared', 'onEndChallengePhase']);
    }

    onAttackersDeclared(event, challenge) {
        if(challenge.challengeType !== 'power' || challenge.attackers.length === 0 || challenge.attackingPlayer !== this.controller || this.isBlank()) {
            return;
        }

        challenge.modifyAttackerStrength(2);
        this.game.addMessage('{0} uses {1} to add 2 to the strength of this {2} challenge', this.controller, this, challenge.challengeType);
    }

    onDefendersDeclared(event, challenge) {
        if(challenge.challengeType !== 'power' || challenge.defenders.length === 0 || challenge.defendingPlayer !== this.controller || this.isBlank()) {
            return;
        }

        challenge.modifyDefenderStrength(2);
        this.game.addMessage('{0} uses {1} to add 2 to the strength of this {2} challenge', this.controller, this, challenge.challengeType);
    }    

    onEndChallengePhase() {
        if(this.kneeled || this.isBlank()) {
            return;
        }

        if(this.controller.getNumberOfChallengesLost('power') === 0) {
            this.game.promptWithMenu(this.controller, this, {
                activePrompt: {
                    menuTitle: 'Kneel ' + this.name + '?',
                    buttons: [
                        { text: 'Yes', method: 'drawTwo' },
                        { text: 'No', method: 'cancel' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to use ' + this.name
            });
        }
    }

    drawTwo(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} kneels {1} to draw 2 cards', player, this);

        player.drawCardsToHand(2);

        return true;
    }

    cancel(player) {
        if(this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }
}

TheRedKeep.code = '01061';

module.exports = TheRedKeep;
