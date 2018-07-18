const _ = require('underscore');
const AllPlayerPrompt = require('../allplayerprompt.js');

class SetupProvincesPrompt extends AllPlayerPrompt {
    constructor(game) {
        super(game);
        this.strongholdProvince = {};
        this.clickedDone = {};
        this.selectedCards = {};
        this.selectableCards = {};
        for(let player of game.getPlayers()) {
            this.selectedCards[player.uuid] = [];
            this.selectableCards[player.uuid] = player.provinceDeck.toArray();
        }
    }

    completionCondition(player) {
        return this.clickedDone[player.uuid];
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        _.each(this.game.getPlayers(), player => {
            player.setSelectableCards(this.selectableCards[player.uuid]);
        });
    }

    activePrompt(player) {
        let menuTitle = 'Choose province order, or press Done to place them at random';
        if(!this.strongholdProvince[player.uuid]) {
            menuTitle = 'Select stronghold province';
        }

        return {
            selectCard: true,
            selectRing: true,
            selectOrder: !!this.strongholdProvince[player.uuid],
            menuTitle: menuTitle,
            buttons: this.strongholdProvince[player.uuid] ? [{ text: 'Done', arg: 'done' }, { text: 'Change stronghold province', arg: 'change' }] : [],
            promptTitle: 'Place Provinces'
        };
    }

    onCardClicked(player, card) {
        if(!player || !this.activeCondition(player) || !card) {
            return false;
        } else if(!this.selectableCards[player.uuid].includes(card)) {
            return false;
        } else if(!this.strongholdProvince[player.uuid]) {
            if(card.cannotBeStrongholdProvince()) {
                return false;
            }
            this.strongholdProvince[player.uuid] = card;
            card.inConflict = true;
            this.selectableCards[player.uuid] = this.selectableCards[player.uuid].filter(c => c !== card);
            return true;
        }

        if(!this.selectedCards[player.uuid].includes(card)) {
            this.selectedCards[player.uuid].push(card);
        } else {
            this.selectedCards[player.uuid] = this.selectedCards[player.uuid].filter(c => c !== card);
        }
        player.setSelectedCards(this.selectedCards[player.uuid]);
        return true;
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to finish selecting provinces'
        };
    }

    menuCommand(player, arg) {
        if(arg === 'change' || !this.strongholdProvince[player.uuid]) {
            this.strongholdProvince[player.uuid].inConflict = false;
            this.strongholdProvince[player.uuid] = null;
            this.selectableCards[player.uuid] = player.provinceDeck.toArray();
            return true;
        } else if(arg !== 'done') {
            return false;
        }

        this.strongholdProvince[player.uuid].inConflict = false;
        this.clickedDone[player.uuid] = true;
        this.game.addMessage('{0} has placed their provinces', player);
        player.moveCard(this.strongholdProvince[player.uuid], 'stronghold province');
        let provinces = this.selectedCards[player.uuid].concat(_.shuffle(this.selectableCards[player.uuid]));
        for(let i = 1; i < 5; i++) {
            player.moveCard(provinces[i - 1], 'province ' + i.toString());
        }
        player.hideProvinceDeck = true;

        return true;
    }
}

module.exports = SetupProvincesPrompt;
