const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class TestOfCourage extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into conflict',
            condition: () => this.game.currentConflict && this.controller.opponent && this.controller.showBid < this.controller.opponent.showBid,
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict',
                cardCondition: card => card.controller === this.controller && card.isFaction('lion')
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, moving {2} into conflict', this.controller, this, context.target);
                let events = this.game.applyGameAction(context, { moveToConflict: context.target });
                let moveEvent = _.find(events, event => event.gameAction === 'moveToConflict');
                moveEvent.addThenGameAction(context, { honor: context.target });
            }
        });
    }
}

TestOfCourage.id = 'test-of-courage';

module.exports = TestOfCourage;
