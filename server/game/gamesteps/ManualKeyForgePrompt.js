import AllPlayerPrompt from './allplayerprompt.js';

class ManualKeyForgePrompt extends AllPlayerPrompt {
    constructor(game, requestingPlayer, color) {
        super(game);

        this.requestingPlayer = requestingPlayer;
        this.completedPlayers = new Set([requestingPlayer]);
        this.cancelled = false;
        this.color = color;
    }

    completionCondition(player) {
        return this.cancelled || this.completedPlayers.has(player);
    }

    activePrompt() {
        return {
            menuTitle: {
                text: '{{player}} requests to forge the {{color}} key. Allow?',
                values: { player: this.requestingPlayer.name, color: this.color }
            },
            buttons: [
                { arg: 'yes', text: 'Yes' },
                { arg: 'no', text: 'No' }
            ]
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to approve forging the key'
        };
    }

    onMenuCommand(player, arg) {
        if (arg === 'yes') {
            this.game.addAlert('info', '{0} allows forging the {1} key', player, this.color);
            this.completedPlayers.add(player);
        } else {
            this.game.addAlert('info', '{0} disallows forging a key', player);
            this.cancelled = true;
        }

        return true;
    }

    onCompleted() {
        if (this.cancelled) {
            return;
        }

        this.game.addAlert(
            'danger',
            '{0} forges the {1} ',
            this.requestingPlayer,
            `forgedkey${this.color}`
        );
        this.requestingPlayer.keys[this.color] = true;
        this.requestingPlayer.keysForgedThisRound.push(this.color);
    }
}

export default ManualKeyForgePrompt;
