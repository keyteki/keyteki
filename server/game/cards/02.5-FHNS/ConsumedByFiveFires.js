const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/GameActions');

class ConsumedByFiveFires extends DrawCard {
    // TODO: need refactoring
    setupCardAbilities() {
        this.action({
            title: 'Remove up to 5 fate from characters',
            condition: context => context.player.cardsInPlay.any(card => card.hasTrait('shugenja')) && context.player.opponent &&
                                  context.player.opponent.cardsInPlay.any(card => card.fate > 0),
            effect: 'to remove fate from {1}\'s characters',
            effectArgs: context => context.player.opponent,
            handler: context => this.chooseCard(context, {}, [])
        });
    }

    chooseCard(context, targets, messages) {
        let fateRemaining = 5 - _.reduce(targets, (totalFate, fateToRemove) => totalFate + fateToRemove, 0);
        if(fateRemaining === 0 || !context.player.opponent.cardsInPlay.any(card => card.fate > 0 && !_.keys(targets).includes(card.uuid))) {
            this.game.addMessage('{0} chooses to: {1}', context.player, messages);
            let keys = _.keys(targets);
            let events = keys.map(key => {
                let card = context.player.opponent.cardsInPlay.find(c => c.uuid === key);
                if(card) {
                    return GameActions.removeFate({ amount: targets[key]}).getEvent(card, context);
                }
            }).filter(obj => obj);
            this.game.openThenEventWindow(events);
            return;
        }
        this.game.promptForSelect(context.player, {
            context: context,
            cardType: 'character',
            cardCondition: card => card.location === 'play area' && card.fate > 0 && card.controller !== context.player && !_.keys(targets).includes(card.uuid),
            onSelect: (player, card) => {
                let choices = _.range(1, Math.min(fateRemaining, card.fate) + 1);
                let handlers = _.map(choices, choice => {
                    return () => {
                        targets[card.uuid] = choice;
                        messages.push('take ' + choice.toString() + ' fate from ' + card.name);
                        this.chooseCard(context, targets, messages);
                    };
                });
                choices.push('Redo');
                handlers.push(() => {
                    this.chooseCard(context, {}, []);
                });
                this.game.promptWithHandlerMenu(player, {
                    activePromptTitle: 'How much fate do you want to remove?',
                    choices: choices,
                    handlers: handlers,
                    context: context
                });
                return true;
            },
            onCancel: () => {
                this.game.addMessage('{0} chooses to: {1}', context.player, messages);
                let keys = _.keys(targets);
                let events = this.game.applyGameAction(context, { removeFate: context.player.opponent.cardsInPlay.filter(card => keys.includes(card.uuid)) });
                _.each(events, event => event.fate = targets[event.card.uuid]);
                return true;
            }
        });
    }
}

ConsumedByFiveFires.id = 'consumed-by-five-fires';

module.exports = ConsumedByFiveFires;
