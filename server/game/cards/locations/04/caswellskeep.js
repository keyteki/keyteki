const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class CaswellsKeep extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPlotsRevealed: event => _.any(event.plots, plot => plot.controller === this.controller)
            },
            handler: () => {
                var buttons = _.map(this.game.getPlayers(), player => ({
                    text: player.name, arg: player.name, method: 'selectPlayer'
                }));

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose a player',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    selectPlayer(player, playerName) {
        this.selectedPlayer = this.game.getPlayerByName(playerName);

        if(!this.selectedPlayer) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to look at the top 2 cards of {2}\'s deck', player, this, this.selectedPlayer);

        this.topCards = this.selectedPlayer.searchDrawDeck(2);

        var buttons = _.map(this.topCards, card => ({
            method: 'selectCard', card: card
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    selectCard(player, cardId) {
        var card = _.find(this.topCards, c => c.uuid === cardId);
        var otherCard = _.find(this.topCards, c => c.uuid !== cardId);

        if(!card) {
            return false;
        }

        this.selectedPlayer.moveCard(card, 'draw deck', { bottom: true });
        this.selectedPlayer.moveCard(otherCard, 'draw deck', { bottom: false });
        this.game.addMessage('{0} placed 1 card on the bottom of {1}\'s deck and the rest on top', this.controller, this.selectedPlayer);

        return true;
    }
}

CaswellsKeep.code = '04064';

module.exports = CaswellsKeep;
