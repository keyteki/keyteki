const PlotCard = require('../../../plotcard.js');

class TheKingsPeace extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallenge: (event, challenge) => challenge.attackingPlayer !== this.controller && (challenge.challengeType === 'military' || challenge.challengeType === 'power')
            },
            handler: () => {
                var otherPlayer = this.game.currentChallenge.attackingPlayer;
                var buttons = [];

                if(!otherPlayer.faction.kneeled) {
                    buttons.push({ text: 'Kneel faction card', method: 'kneel' });
                }

                if(otherPlayer.faction.power >= 1) {
                    buttons.push({ text: 'Move 1 power', method: 'movePower' });
                }

                if(buttons.length === 0) {
                    this.cancelChallenge(otherPlayer);

                    return true;
                }

                buttons.push({ text: 'Cancel Challenge', method: 'cancelChallenge' });

                this.game.promptWithMenu(otherPlayer, this, {
                    activePrompt: {
                        menuTitle: 'Select choice for ' + this.name,
                        buttons: buttons
                    },
                    waitingPromptTitle: 'Waiting for opponent to choose'
                });

                this.game.addMessage('{0} uses {1} to force {2} to kneel their faction card, move 1 power to {0}\'s faction card or cancel the challenge', this.controller,
                    this, otherPlayer);

                return true;
            }
        });
    }

    kneel(player) {
        player.kneelCard(player.faction);

        this.game.addMessage('{0} chooses to kneel their faction card to let the challenge continue', player);

        return true;
    }

    movePower(player) {
        this.game.transferPower(this.controller, player, 1);

        this.game.addMessage('{0} chooses to transfer 1 power to {1} to let the challenge continue', player, this.controller);

        return true;
    }

    cancelChallenge() {
        this.game.currentChallenge.cancelChallenge();

        this.game.addMessage('{0} uses {1} to cancel the current challenge', this.controller, this);

        return true;
    }
}

TheKingsPeace.code = '02048';

module.exports = TheKingsPeace;
