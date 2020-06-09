const AllPlayerPrompt = require('../allplayerprompt');
const ChainBiddingPrompt = require('./ChainBiddingPrompt');

class AdaptiveDeckSelectionPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.gameFormat = game.gameFormat;
        this.adaptive = game.adaptive;
        this.clickedButton = {};
        this.players = game.getPlayers();
    }

    completionCondition(player) {
        return (
            !(this.game.gameFormat === 'adaptive-bo1') ||
            !!this.clickedButton[player.name] ||
            this.players.length < 2
        );
    }

    activePrompt() {
        return {
            promptTitle: 'Deck Selection',
            menuTitle: 'Choose the deck to bid on',
            buttons: this.players.map((player) => ({
                arg: player.deckData.uuid,
                text: player.deckData.name
            }))
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose to continue' };
    }

    menuCommand(player, arg) {
        const otherPlayer = this.game.getOtherPlayer(player);
        const deck = arg === player.deckData.uuid ? player.deckData : otherPlayer.deckData;
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

    onCompleted() {
        const [player1, player2] = this.game.adaptive.selection;

        if (!player1 || !player2) {
            return;
        }

        if (player1.uuid === player2.uuid) {
            this.game.addMessage(
                'Both players have selected {0}. Bidding will start at 0 chains by {1}',
                player1.deckName,
                player1.owner
            );
            this.game.queueStep(new ChainBiddingPrompt(this.game, player1));
        } else {
            this.game.addMessage('Players have selected different decks. Chains will not be bid.');
            if (player1.owner !== player1.player) {
                this.game.reInitialisePlayers(true);
            }
        }
    }
}

module.exports = AdaptiveDeckSelectionPrompt;
