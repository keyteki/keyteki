const DrawCard = require('../../drawcard.js');

class KaradaDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.giveFateToOpponent(1),
            target: {
                cardType: 'attachment',
                cardCondition: card => card.parent && card.parent.controller !== this.controller
            },
            handler: context => {
                context.target.controller = this.controller;
                if(this.controller.cardsInPlay.any(card => card.type === 'character' && this.controller.canAttach(context.target, card))) {
                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Choose a character to attach ' + context.target.name + ' to',
                        source: this,
                        cardType: 'character',
                        cardCondition: card => this.controller.canAttach(context.target, card) && card.controller === this.controller,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} uses {1}, paying 1 fate to {2} in order to take control of {3} and attach it to {4}', player, this, player.opponent, context.target, card);
                            player.attach(context.target, card);
                            return true;
                        }
                    });
                } else {
                    this.game.addMessage('{0} uses {1}, paying 1 fate to {2} in order to take control of {3} but cannot attach to anyone so it is discarded', this.controller, this, this.controller.opponent, context.target);
                    context.target.owner.discardCardFromPlay(context.target);
                }
            }
        });
    }
}

KaradaDistrict.id = 'karada-district';

module.exports = KaradaDistrict;
