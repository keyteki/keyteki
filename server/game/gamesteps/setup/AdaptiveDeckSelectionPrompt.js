const AllPlayerPrompt = require('../allplayerprompt');

class AdaptiveDeckSelectionPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.gameFormat = game.gameFormat;
        this.adaptive = game.adaptive;
        this.clickedButton = {};
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name] || !(this.gameFormat === 'adaptive-bo1');
    }

    activePrompt() {
        return {
            promptTitle: 'Deck Selection',
            menuTitle: 'Choose the deck to bid on',
            buttons: [
                { arg: 'mine', text: 'Mine' },
                { arg: 'opponent', text: 'Opponents' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue' };
    }

    menuCommand(player, arg) {
        const otherPlayer = this.game.getOtherPlayer(player);
        const deck = arg === 'mine' ? player.deckData : otherPlayer.deckData;
        let selection = {
            player: player.name,
            deckName: deck.name,
            uuid: deck.uuid,
            owner: deck.username
        };

        this.adaptive.selection.push(selection);

        this.clickedButton[player.name] = true;
        return true;
    }
}

module.exports = AdaptiveDeckSelectionPrompt;
