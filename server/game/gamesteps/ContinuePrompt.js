const AgreementPrompt = require('./AgreementPrompt');

class ContinuePrompt extends AgreementPrompt {
    getWaitingTitle() {
        return 'Waiting for opponent to agree to continue';
    }

    getRequestMenuTitle() {
        return {
            text: '{{player}} would like to continue playing. Allow?',
            values: { player: this.requestingPlayer.name }
        };
    }

    addCancelAlert(player) {
        this.game.addAlert('info', '{0} cancels their continue request', player);
    }

    addAcceptAlert(player) {
        this.game.addAlert('info', '{0} agrees to continue playing', player);
    }

    addDeclineAlert(player) {
        this.game.addAlert('info', '{0} would not like to continue playing', player);
    }
}

module.exports = ContinuePrompt;
