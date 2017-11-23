const DrawCard = require('../../drawcard.js');

class TestOfCourage extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into conflict',
            condition: () => this.game.currentConflict && this.controller.opponent && this.controller.showBid < this.controller.opponent.showBid,
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict',
                cardCondition: card => card.location === 'play area' && !card.isParticipating() && 
                                       card.controller === this.controller && card.isFaction('lion')
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, moving {2} into conflict', this.controller, this, context.target);
                let honorEvent = {
                    name: 'onCardHonored',
                    params: { player: this.controller, card: context.target, source: this },
                    handler: event => event.card.honor()
                };
                let moveEvent = {
                    name: 'onMoveToConflict',
                    params: { card: context.target, conflict: this.game.currentConflict, thenEvents: [honorEvent] },
                    handler: event => {
                        if(this.controller.isAttackingPlayer()) {
                            event.conflict.addAttacker(event.card);
                        } else {
                            event.conflict.addDefender(event.card);
                        }
                        this.game.addMessage('{0} honors {1}', this, event.card);                        
                        return { resolved: true, success: true };
                    }
                };
                this.game.raiseMultipleEvents([moveEvent], {
                    name: 'onMoveCharactersToConflict',
                    params: { cards: [context.target], conflict: this.game.currentConflict }
                });
            }
        });
    }
}

TestOfCourage.id = 'test-of-courage';

module.exports = TestOfCourage;
