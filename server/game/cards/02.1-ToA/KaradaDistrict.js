const DrawCard = require('../../drawcard.js');

class KaradaDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of an attachment',
            cost: ability.costs.giveFateToOpponent(1),
            target: {
                cardType: 'attachment',
                cardCondition: (card, context) => card.parent && card.parent.controller === context.player.opponent
            },
            effect: 'take control of {0}',
            handler: context => {
                if(context.target.controller === context.player.opponent && context.player.cardsInPlay.any(card => card.type === 'character' && ability.actions.attach({ attachment: context.target }).canAffect(card, context))) {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a character to attach ' + context.target.name + ' to',
                        context: context,
                        cardType: 'character',
                        controller: 'self',
                        gameAction: ability.actions.attach({ attachment: context.target }),
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} attaches {1} to {2}', player, context.target, card);
                            this.game.openEventWindow(ability.actions.attach({ attachment: context.target }).getEvent(card, context));
                            return true;
                        }
                    });
                } else {
                    this.game.addMessage(context.target.controller === context.player.opponent ? '{0} cannot attach {1} to anyone so it is discarded' : '{0} already owns {1} so it is discarded', context.player, context.target);
                    this.game.applyGameAction(context, { discardFromPlay: context.target });
                }
            }
        });
    }
}

KaradaDistrict.id = 'karada-district';

module.exports = KaradaDistrict;
