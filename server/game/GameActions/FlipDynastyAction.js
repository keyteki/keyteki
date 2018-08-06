const CardGameAction = require('./CardGameAction');

class FlipDynastyAction extends CardGameAction {
    setup() {
        this.name = 'reveal';
        this.targetType = ['character', 'holding'];
        this.effectMsg = 'reveal the facedown card in {1}';
        this.effectArgs = () => this.target[0].location;
    }

    canAffect(card, context) {
        if(['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && card.isDynasty && card.facedown) {
            return super.canAffect(card, context);
        }
        return false;
    }

    getEvent(card, context) {
        return super.createEvent('onDynastyCardTurnedFaceup', { card: card, context: context }, () => {
            context.game.addMessage('{0} reveals {1}', context.source, card);
            card.facedown = false;
        });
    }
}

module.exports = FlipDynastyAction;
