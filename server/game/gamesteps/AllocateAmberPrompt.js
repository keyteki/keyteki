const UiPrompt = require('./uiprompt.js');

// Prompts the player to distribute a fixed number of amber tokens across
// creatures by repeatedly clicking targets. All selections are gathered up
// front and the captures are queued as a single batch via the onSelect
// callback, so creature state changes (e.g. an Essence Entangler reducing
// power as amber is captured) only resolve after every choice is made,
// rather than between individual clicks.
class AllocateAmberPrompt extends UiPrompt {
    constructor(game, properties) {
        super(game);

        this.choosingPlayer = game.activePlayer;
        this.properties = properties;
        this.context = properties.context;
        this.selector = properties.selector;
        this.amberStep = properties.amberStep || 1;
        this.cardAmber = {};
        this.totalAllocated = 0;
    }

    continue() {
        if (!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        this.choosingPlayer.setSelectableCards(this.selector.getAllLegalTargets(this.context));
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = [];
        if (this.game.manualMode) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }

        return {
            selectCard: true,
            selectOrder: false,
            menuTitle: this.properties.menuTitle || 'Choose a creature to capture 1 amber on',
            buttons: buttons,
            promptTitle: { text: '{{card}}', values: { card: this.context.source.name } },
            controls: [
                {
                    type: 'targeting',
                    source: this.context.source.getShortSummary(),
                    targets: []
                }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player, card) {
        if (player !== this.choosingPlayer) {
            return false;
        }

        if (!this.selector.canTarget(card, this.context)) {
            return false;
        }

        if (!this.cardAmber[card.uuid]) {
            this.cardAmber[card.uuid] = 0;
        }
        this.cardAmber[card.uuid] += this.amberStep;
        this.totalAllocated += 1;

        if (this.totalAllocated >= this.properties.numSteps) {
            this.properties.onSelect(this.cardAmber);
            this.complete();
        }
        return true;
    }

    menuCommand(player, arg) {
        if (arg === 'cancel') {
            this.complete();
            return true;
        }

        return false;
    }

    complete() {
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        this.cardAmber = {};
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = AllocateAmberPrompt;
