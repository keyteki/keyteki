import AllPlayerPrompt from '../allplayerprompt.js';

class ChainBiddingPrompt extends AllPlayerPrompt {
    constructor(game, bidDeck) {
        super(game);
        this.bidDeck = bidDeck;
        this.gameFormat = game.gameFormat;
        this.adaptive = game.adaptive;
        this.clickedButton = {};
        this.clickedButton[bidDeck.owner] = true;
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name];
    }

    activePrompt() {
        const arr = [...Array(10).keys()].map((x, i) => i + this.adaptive.chains + 1);
        return {
            promptTitle: 'Bidding',
            menuTitle: 'Bid chains for selected deck',
            buttons: [...arr.map((x) => ({ arg: x, text: x })), { arg: 'pass', text: 'Pass' }]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to bid or pass' };
    }

    menuCommand(player, arg) {
        if (arg === 'pass') {
            let deck = this.adaptive.selection[0];
            let link = {
                link: 'https://www.keyforgegame.com/deck-details/' + deck.uuid,
                argType: 'link',
                label: deck.deckName
            };
            this.game.addMessage('{0} passes.', player, arg);
            const otherPlayer = this.game.getOtherPlayer(player);

            if (this.bidDeck.owner !== otherPlayer.name) {
                this.game.reInitialisePlayers(true);
            }

            this.game.addMessage(
                '{0} has won the bid with {1} chains and will play {2}',
                otherPlayer.name,
                this.adaptive.chains,
                link
            );

            this.game.changeStat(otherPlayer.name, 'chains', this.adaptive.chains, true);
            this.game.adaptive.biddingWinner = otherPlayer.name;
            this.clickedButton[player.name] = true;
        } else {
            this.game.addMessage('{0} bids {1} chains', player, arg);
            this.adaptive.chains = +arg;
            this.clickedButton = { [player.name]: true };
        }

        return true;
    }
}

export default ChainBiddingPrompt;
