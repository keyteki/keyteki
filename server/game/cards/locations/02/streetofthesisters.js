const DrawCard = require('../../../drawcard.js');

class StreetOfTheSisters extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(event, challenge) {
        if(this.controller.faction.kneeled || this.isBlank()) {
            return;
        }

        if(challenge.winner !== this.controller || challenge.strengthDifference < 5 || challenge.challengeType !== 'power') {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Kneel faction card', method: 'kneel' },
                    { text: 'Cancel', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to trigger ' + this.name
        });
    }

    kneel(player) {
        player.faction.kneeled = true;

        this.game.addPower(player, 1);

        this.game.addMessage('{0} uses {1} to gain 1 power for their faction', player, this);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

StreetOfTheSisters.code = '02018';

module.exports = StreetOfTheSisters;
