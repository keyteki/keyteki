const _ = require('underscore');

const BaseStep = require('./basestep.js');

class KillCharacters extends BaseStep {
    constructor(game, cards, allowSave) {
        super(game);

        this.cards = cards;
        this.allowSave = allowSave;
    }

    continue() {
        let cardsInPlay = _.filter(this.cards, card => card.location === 'play area');
        this.game.applyGameAction('killed', cardsInPlay, killable => {
            _.each(killable, card => {
                card.markAsInDanger();
            });

            this.game.raiseSimultaneousEvent(killable, {
                eventName: 'onCharactersKilled',
                params: {
                    allowSave: this.allowSave
                },
                handler: event => this.handleMultipleKills(event),
                perCardEventName: 'onCharacterKilled',
                perCardHandler: event => this.doKill(event)
            });
            this.game.queueSimpleStep(() => {
                _.each(killable, card => {
                    card.clearDanger();
                });
            });
        });
    }

    handleMultipleKills(event) {
        this.event = event;

        _.each(event.cards, card => {
            this.automaticSave(card);
        });

        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.promptPlayerForDeadPileOrder(player);
        });
    }

    automaticSave(card) {
        if(card.location !== 'play area') {
            this.event.saveCard(card);
        } else if(!card.canBeKilled()) {
            this.game.addMessage('{0} controlled by {1} cannot be killed',
                card, card.controller);
            this.event.saveCard(card);
        } else if(!card.dupes.isEmpty() && this.event.allowSave) {
            if(card.controller.removeDuplicate(card)) {
                this.game.addMessage('{0} discards a duplicate to save {1}', card.controller, card);
                this.event.saveCard(card);
            }
        }
    }

    promptPlayerForDeadPileOrder(player) {
        let cardsOwnedByPlayer = _.filter(this.event.cards, card => card.owner === player);

        if(_.size(cardsOwnedByPlayer) <= 1) {
            return;
        }

        this.game.promptForSelect(player, {
            ordered: true,
            multiSelect: true,
            numCards: _.size(cardsOwnedByPlayer),
            activePromptTitle: 'Select order to place cards in dead pile (top first)',
            cardCondition: card => cardsOwnedByPlayer.includes(card),
            onSelect: (player, selectedCards) => {
                if(cardsOwnedByPlayer.length !== selectedCards.length) {
                    return false;
                }

                this.event.cards = _.reject(this.event.cards, card => card.owner === player).concat(selectedCards.reverse());

                return true;
            }
        });
    }

    doKill(event) {
        let card = event.card;
        let player = card.controller;

        if(card.location !== 'play area') {
            event.cancel();
            return;
        }

        player.moveCard(card, 'dead pile');
        this.game.addMessage('{0} kills {1}', player, card);
    }
}

module.exports = KillCharacters;
