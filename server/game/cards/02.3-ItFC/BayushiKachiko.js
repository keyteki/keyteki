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
                let sendHomeHandler = event => {
                    let result = { resolved: true, success: false};
                    if(event.card.isParticipating() && event.card.allowGameAction('sendHome', context)) {
                        event.conflict.removeFromConflict(event.card);
                        if(event.card.allowGameAction('bow', context)) {
                            context.game.promptWithHandlerMenu(context.player, {
                                source: context.source,
                                activePromptTitle: 'Do you want to bow ' + event.card.name,
                                choices: ['Yes', 'No'],
                                handlers: [
                                    () => {
                                        context.game.addMessage('{0} chooses to bow {1} using {2}', context.player, event.card, context.source);
                                        result.success = true;
                                    },
                                    () => true
                                ]
                            });
                        }                        
                    }
                    return result;
                };
                let thenEvent = {
                    name: 'onCardBowed',
                    params: { player: context.player, card: context.target, source: context.source},
                    handler: () => context.target.bowed = true
                };
                let sendHomeEvent = {
                    name: 'onSendHome',
                    params: { card: context.target, conflict: this.game.currentConflict, thenEvents: [thenEvent] },
                    handler: sendHomeHandler
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
