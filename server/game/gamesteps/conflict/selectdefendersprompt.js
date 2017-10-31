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
        this.conflict = conflict;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        this.conflict.calculateSkill();
        let promptTitle = (capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.conflictRing] + ' Conflict: ' 
            + this.conflict.attackerSkill + ' vs ' + this.conflict.defenderSkill);
        return {
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
        if(this.conflict.maxAllowedDefenders !== 0 && this.conflict.defenders.length >= this.conflict.maxAllowedDefenders && !_.contains(this.conflict.defenders, card)) {
            return false;
        }

        if(!this.conflict.defenders.includes(card)) {
            this.conflict.addDefender(card);
        } else {
            this.conflict.removeFromConflict(card);
        }

        return true;
    }

    menuCommand() {
        _.each(this.conflict.defenders, card => card.covert = false);
        this.complete();
    }
}

module.exports = SelectDefendersPrompt;
