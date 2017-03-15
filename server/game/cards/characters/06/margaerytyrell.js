const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, player, card) => {
                    return card.isUnique() && (card.hasTrait('king') || card.hasTrait('lord')) && card.controller === this.controller;
                },
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                var characters = this.controller.searchDrawDeck(card => {
                    return card.isUnique() && (card.hasTrait('king') || card.hasTrait('lord')) && this.controller.deadPile.filter(c => {
                        return c.name === card.name;
                    }).length === 0;
                   
                });
                var uniqueCardsByTitle = [];
                var selectableCharacters = _.filter(characters, (char) => {
                    if(uniqueCardsByTitle.indexOf(char.cardData.label) >= 0) {
                        return false;
                    }
                    uniqueCardsByTitle.push(char.cardData.label);
                    return true;
                });
                var buttons = _.map(selectableCharacters, card => {
                    return { text: card.cardData.label, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
                });
                buttons.push({ text: 'Done', method: 'doneSelecting' });
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card to put into play',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        var card = player.findCardByUuid(player.drawDeck, cardId);
        if(!card) {
            return false;
        }
        player.putIntoPlay(card);
        player.shuffleDrawDeck();
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
        return true;
    }

    doneSelecting(player) {
        player.shuffleDrawDeck();
        this.game.addMessage('{0} does not use {1} to put a card into play', player, this);
        return true;
    }
}

MargaeryTyrell.code = '06003';

module.exports = MargaeryTyrell;
