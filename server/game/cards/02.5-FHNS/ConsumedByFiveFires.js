const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ConsumedByFiveFires extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove up to 5 fate from characters',
            condition: () => this.controller.cardsInPlay.any(card => card.hasTrait('shugenja')) && this.controller.opponent &&
                             this.controller.opponent.cardsInPlay.any(card => card.fate > 0),
            methods: ['consumedByFiveFiresChooseCard'],
            handler: () => {
                this.game.addMessage('{0} plays {1}', this.controller, this);
                this.consumedByFiveFiresChooseCard({}, []);
            }
        })
    }

    consumedByFiveFiresChooseCard(targets, messages) {
        let fateRemaining = 5 - _.reduce(targets, (totalFate, fateToRemove) => totalFate + fateToRemove);
        if(fateRemaining === 0 || !this.controller.opponent.cardsInPlay.any(card => card.fate > 0 && !_.keys(targets).includes(card.uuid))) {
            this.game.addMessage('{0} chooses to: {1}', this.controller, messages);
            let events = _.map(targets, (fate, uuid) => {
                let card = this.controller.opponent.findCardInPlayByUuid(uuid);
                if(card) {
                    return {
                        name: 'onCardRemoveFate',
                        params: { card: card, fate: fate }
                    };
                }
            });
            this.game.raiseMultipleEvents(_.compact(events));
        }
        this.game.promptForSelect(this.controller, {
            source: this,
            cardType: 'character',
            cardCondition: card => card.location === 'play area' && card.fate > 0 && card.controller !== this.controller && !_.keys(targets).includes(card.uuid),
            onSelect: (player, card) => {
                let choices = _.range(1, Math.min(fateRemaining, card.fate) + 1);
                let handlers = _.map(choices, choice => {
                    return () => {
                        targets[card.uuid] = choice;
                        messages.push('take ' + choice.toString() + ' fate from ' + card.name);
                        this.consumedByFiveFiresChooseCard(targets, messages);
                    };
                });
                choices.push('Redo');
                handlers.push(() => {
                    this.consumedByFiveFiresChooseCard({}, []);
                });
                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'How much fate do you want to remove?',
                    choices: choices,
                    handlers: handlers,
                    source: this
                });
                return true;
            },
            onCancel: () => {
                this.game.addMessage('{0} chooses to: {1}', this.controller, messages);
                let events = _.map(targets, (fate, uuid) => {
                    let card = this.controller.opponent.findCardInPlayByUuid(uuid);
                    if(card) {
                        return {
                            name: 'onCardRemoveFate',
                            card: card,
                            fate: fate
                        };
                    }
                });
                this.game.raiseMultipleEvents(_.compact(events));
                return true;
            }
        });
    }
}

ConsumedByFiveFires.id = 'consumed-by-five-fires'; 

module.exports = ConsumedByFiveFires;
