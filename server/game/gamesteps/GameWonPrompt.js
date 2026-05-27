const AllPlayerPrompt = require('./allplayerprompt');
const ContinuePrompt = require('./ContinuePrompt');
const RematchPrompt = require('./RematchPrompt');

const ButtonArgToMode = {
    'rematch-same-decks': 'same',
    'rematch-swap-decks': 'swap',
    'rematch-change-decks': 'change'
};

const ButtonArgToRequest = {
    continue: 'to continue',
    'rematch-same-decks': 'a rematch with the same decks',
    'rematch-swap-decks': 'a rematch with swapped decks',
    'rematch-change-decks': 'a rematch with different decks'
};

class GameWonPrompt extends AllPlayerPrompt {
    constructor(game, winner) {
        super(game);
        this.winner = winner;
        this.clickedButton = {};
    }

    completionCondition(player) {
        return !!this.clickedButton[player.name];
    }

    activePrompt() {
        const isAdaptive = this.game.gameFormat === 'adaptive-bo1';
        const buttons = [
            { arg: 'continue', text: 'Continue Playing' },
            { arg: 'rematch-same-decks', text: 'Rematch: Same Decks' }
        ];
        // Adaptive has its own deck-swap mechanic built into setup
        if (!isAdaptive) {
            buttons.push({ arg: 'rematch-swap-decks', text: 'Rematch: Swap Decks' });
        }
        buttons.push({ arg: 'rematch-change-decks', text: 'Rematch: Change Decks' });

        return {
            promptTitle: 'Game Won',
            menuTitle: {
                text: '{{player}} has won the game!',
                values: { player: this.winner.name }
            },
            buttons
        };
    }

    menuCommand(player, arg) {
        const description = ButtonArgToRequest[arg];
        if (!description) {
            return true;
        }

        this.game.addMessage('{0} would like {1}', player, description);
        this.clickedButton[player.name] = true;

        const callbacks = {
            // If the opponent agrees, the entire Game Won prompt is done.
            onAccept: () => {
                if (arg === 'continue') {
                    // Mark the game so a subsequent concede re-opens this menu.
                    this.game.continuePlaying = true;
                }
                for (const p of this.game.getPlayers()) {
                    this.clickedButton[p.name] = true;
                }
            },
            // If the opponent declines, reset the Game Won prompt so both
            // players see the full continue/rematch menu again.
            onCancel: () => {
                this.clickedButton = {};
            }
        };

        if (arg === 'continue') {
            this.game.queueStep(new ContinuePrompt(this.game, player, callbacks));
        } else {
            this.game.queueStep(
                new RematchPrompt(this.game, player, ButtonArgToMode[arg], callbacks)
            );
        }

        return true;
    }
}

module.exports = GameWonPrompt;
