const DrawCard = require('../../drawcard.js');

class BayushiKachiko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send a character home',
            condition: () => this.isParticipating() && this.game.currentConflict.conflictType === 'political',
            target: {
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.isParticipating() && card.getPoliticalSkill() < this.getPoliticalSkill()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                let bowEvent = {
                    name: 'onCardBowed',
                    params: { card: context.target, source: context.source, gameAction: 'bow' },
                    handler: () => context.target.bow()
                };
                let menuEvent = {
                    name: 'unnamedEvent',
                    params: { context: context, thenEvents: [bowEvent] },
                    handler: event => {
                        if(!context.target.allowGameAction('bow', context)) {
                            event.cancel();
                            return;
                        }
                        this.game.promptWithHandlerMenu(context.player, {
                            source: context.source,
                            activePromptTitle: 'Do you want to bow ' + context.target.name + '?',
                            choices: ['Yes', 'No'],
                            handlers: [
                                () => context.game.addMessage('{0} chooses to bow {1} using {2}', context.player, context.target, context.source),
                                () => event.cancel()
                            ]
                        });
                    }
                };
                let sendHomeEvent = {
                    name: 'onSendHome',
                    params: { card: context.target, conflict: this.game.currentConflict, gameAction: 'sendHome', thenEvents: [menuEvent] },
                    handler: () => this.game.currentConflict.removeFromConflict(context.target)
                };
                this.game.raiseMultipleEvents([sendHomeEvent], {
                    name: 'onSendCharactersHome',
                    params: { cards: [context.target], conflict: this.game.currentConflict }
                });
            }
        });
    }
}

BayushiKachiko.id = 'bayushi-kachiko';

module.exports = BayushiKachiko;
