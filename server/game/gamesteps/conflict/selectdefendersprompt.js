const _ = require('underscore');
const UiPrompt = require('../uiprompt.js');

const capitalize = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class SelectDefendersPrompt extends UiPrompt {
    constructor(game, player, conflict) {
        super(game);

        this.player = player;
        this.selectedCards = [];
        this.conflict = conflict;
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        let selectableCards = this.player.cardsInPlay.filter(card => {
            return this.checkCardCondition(card);
        });
        this.player.setSelectableCards(selectableCards);
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        this.conflict.calculateSkill();
        let promptTitle = (capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.conflictRing] + ' Conflict: ' 
            + this.conflict.attackerSkill + ' vs ' + this.conflict.defenderSkill);
        return {
            selectCard: true,
            menuTitle: 'Choose defenders',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose defenders' };
    }

    onCardClicked(player, card) {
        if(player !== this.player) {
            return false;
        }

        if(!this.checkCardCondition(card)) {
            return false;
        }

        return this.selectCard(card);
    }

    checkCardCondition(card) {

        return (
            card.getType() === 'character' && 
            card.controller === this.player &&
            card.canDeclareAsDefender()
        );
    }

    selectCard(card) {
        if(this.conflict.maxAllowedDefenders !==0 && this.selectedCards.length >= this.conflict.maxAllowedDefenders && !_.contains(this.selectedCards, card)) {
            return false;
        }

        if(!this.selectedCards.includes(card)) {
            this.selectedCards.push(card);
        } else {
            this.selectedCards = _.reject(this.selectedCards, c => c === card);
        }
        this.player.setSelectedCards(this.selectedCards);

        return true;
    }

    onMenuCommand(player, arg) {
        if(player !== this.player) {
            return false;
        }

        this.complete();
    }

    complete() {
        this.conflict.addDefenders(this.selectedCards);
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        this.selectedCards = [];
        this.player.clearSelectedCards();
        this.player.clearSelectableCards();

    }
}

module.exports = SelectDefendersPrompt;
