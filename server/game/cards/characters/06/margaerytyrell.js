const DrawCard = require('../../../drawcard.js');

class MargaeryTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: event => {
                    return event.card.isUnique() && (event.card.hasTrait('king') || event.card.hasTrait('lord')) && event.card.controller === this.controller;
                }
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card to put into play',
                    cardCondition: card => card.isUnique() && (card.hasTrait('king') || card.hasTrait('lord')) && this.controller.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to put a card into play', player, this);
    }
}

MargaeryTyrell.code = '06003';

module.exports = MargaeryTyrell;
