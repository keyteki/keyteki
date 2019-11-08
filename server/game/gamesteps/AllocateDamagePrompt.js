const UiPrompt = require('./uiprompt.js');

class AllocateDamagePrompt extends UiPrompt {
    constructor(game, properties) {
        super(game);

        this.choosingPlayer = game.activePlayer;
        this.properties = properties;
        this.context = properties.context;
        this.selector = properties.selector;
        this.cardDamage = {};
    }

    continue() {
        if(!this.isComplete()) {
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
        if(this.game.manualMode) {
            buttons = buttons.concat({ text: 'Cancel Prompt', arg: 'cancel' });
        }

        return {
            selectCard: true,
            selectOrder: false,
            menuTitle: { text: 'Choose a creature to deal {{damageStep}} damage to', values: { damageStep: this.properties.damageStep.toString() } },
            buttons: buttons,
            promptTitle: { text: '{{card}}', values: { card: this.context.source.name } },
            cardDamage: this.cardDamage,
            controls: [{
                type: 'targeting',
                source: this.context.source.getShortSummary(),
                targets: []
            }]
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player, card) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.selector.canTarget(card, this.context)) {
            return false;
        }

        if(!this.selectCard(card)) {
            return false;
        }

        if(Object.values(this.cardDamage).reduce((total, damage) => total + damage) >= this.properties.damageStep * this.properties.numSteps) {
            this.properties.onSelect(this.cardDamage);
            this.complete();
        }
    }

    selectCard(card) {
        if(this.cardDamage[card.uuid]) {
            this.cardDamage[card.uuid] += this.properties.damageStep;
            return true;
        }

        this.cardDamage[card.uuid] = this.properties.damageStep;
        return true;
    }

    menuCommand(player, arg) {
        if(arg === 'cancel') {
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
        this.cardDamage = {};
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = AllocateDamagePrompt;
