const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class SummonedToCourt extends PlotCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'draw'
            },
            handler: () => {
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.playerChoices = [];
                this.promptNextPlayerForChoice();
            }
        });
    }

    promptNextPlayerForChoice() {
        while(this.remainingPlayers.length !== 0) {
            let currentPlayer = this.remainingPlayers.shift();
            if(!currentPlayer.hand.isEmpty()) {
                this.promptPlayerForChoice(currentPlayer);
                return;
            }

            this.game.addMessage('{0} does not have any cards to be revealed by {1}', currentPlayer, this);
        }

        this.revealPlayerChoices();
        this.validChoices = this.getLowestCostChoices();
        this.promptNextPlayerToPutIntoPlay();
    }

    promptPlayerForChoice(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Choose a card to reveal',
            source: this,
            cardCondition: card => card.controller === player && card.location === 'hand',
            onSelect: (player, card) => this.chooseCard(player, card)
        });
    }

    chooseCard(player, card) {
        this.playerChoices.push({ player: player, card: card, cost: card.getCost() });
        this.promptNextPlayerForChoice();
        return true;
    }

    revealPlayerChoices() {
        _.each(this.playerChoices, choice => {
            this.game.addMessage('{0} reveals {1} as their choice for {2}', choice.player, choice.card, this);
        });
    }

    getLowestCostChoices() {
        let characterChoices = _.filter(this.playerChoices, choice => choice.card.getType() === 'character');
        let minCost = _.min(_.pluck(characterChoices, 'cost'));
        return _.filter(characterChoices, choice => choice.cost === minCost);
    }

    promptNextPlayerToPutIntoPlay() {
        if(this.validChoices.length === 0) {
            return;
        }

        let choice = this.validChoices.shift();
        this.promptPlayerToPutIntoPlay(choice.player, choice.card);
    }

    promptPlayerToPutIntoPlay(player, card) {
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Put ' + card.name + ' into play?',
                buttons: [
                    { text: 'Yes', method: 'putChoiceIntoPlay', card: card },
                    { text: 'No', method: 'declinePutIntoPlay', arg: card.uuid }
                ]
            },
            source: this
        });
    }

    putChoiceIntoPlay(player, cardId) {
        let card = player.findCardByUuidInAnyList(cardId);
        player.putIntoPlay(card);
        this.game.addMessage('{0} chooses to put {1} into play using {2}', player, card, this);
        this.promptNextPlayerToPutIntoPlay();
        return true;
    }

    declinePutIntoPlay(player, cardId) {
        let card = player.findCardByUuidInAnyList(cardId);
        this.game.addMessage('{0} declines to put {1} into play using {2}', player, card, this);
        this.promptNextPlayerToPutIntoPlay();
        return true;
    }
}

SummonedToCourt.code = '05048';

module.exports = SummonedToCourt;
