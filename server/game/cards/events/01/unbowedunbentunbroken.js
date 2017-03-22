const DrawCard = require('../../../drawcard.js');

class UnbowedUnbentUnbroken extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card || player.firstPlayer) {
            return false;
        }

        if(!this.game.currentChallenge || this.game.currentChallenge.loser !== this.controller) {
            return false;
        }

        return true;
    }

    play(player) {
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select a challenge type',
                buttons: [
                    { text: 'Military', method: 'trigger', arg: 'military' },
                    { text: 'Intrigue', method: 'trigger', arg: 'intrigue' },
                    { text: 'Power', method: 'trigger', arg: 'power' },
                    { text: 'Cancel', method: 'cancel' }
                ]
            },
            source: this
        });
    }

    trigger(player, challengeType) {
        var otherPlayer = this.game.getOtherPlayer(player);

        if(!otherPlayer) {
            return true;
        }

        otherPlayer.setMaxChallengeForType(challengeType, 0);

        this.game.addMessage('{0} uses {1} to make {2} unable to initiate {3} challenges until the end of the phase', player, this, otherPlayer, challengeType);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancel the resolution of {1}', player, this);

        this.game.addGold(player, this.getCost());
        player.moveCard(this, 'hand');

        return true;
    }
}

UnbowedUnbentUnbroken.code = '01120';

module.exports = UnbowedUnbentUnbroken;
