const DrawCard = require('../../drawcard.js');

class AgashaShunsen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return rings to fetch an attachment',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.returnRings(),
            target: {
                cardType: 'character',
                controller: 'self',
                gameAction: ability.actions.attach(context => {
                    let attachAction = ability.actions.attach();
                    let checkCard = card => {
                        attachAction.attachment = card;
                        return card.getType() === 'attachment' && attachAction.canAffect(context.target, context) &&
                               context.costs.returnRing && card.costLessThan(context.costs.returnRing.length + 1);
                    };
                    let cancelHandler = () => {
                        this.game.addMessage('{0} chooses not to attach anything to {1}', context.player, context.target);
                        context.player.shuffleConflictDeck();
                    };
                    return {
                        attachmentChosenOnResolution: true,
                        promptWithHandlerMenu: {
                            cards: context.player.conflictDeck.filter(card => checkCard(card)),
                            customHandler: (card, gameAction) => {
                                gameAction.attachment = card;
                                this.game.addMessage('{0} chooses to attach {1} to {2}', context.player, card, context.target);
                                context.player.shuffleConflictDeck();
                            },
                            choices: ['Don\'t attach a card'],
                            handlers: [cancelHandler]
                        }
                    };
                })
            },
            effect: 'search their deck for an attachment costing {1} or less and attach it to {0}',
            effectArgs: context => context.costs.returnRing.length
        });
    }
}

AgashaShunsen.id = 'agasha-shunsen';

module.exports = AgashaShunsen;
