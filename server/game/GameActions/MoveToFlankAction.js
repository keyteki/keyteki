const CardGameAction = require('./CardGameAction');

class MoveToFlankAction extends CardGameAction {
    setDefaultProperties() {
        this.left = false;
        this.myControl = false;
    }

    update(context) {
        this.applyProperties(Object.assign({ target: this.getDefaultTargets(context), origin: context.source }, this.propertyFactory(context)));
    }

    setup() {
        this.name = 'moveToFlank';
        this.targetType = ['creature'];
        this.effectMsg = 'move {0} to a flank';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Which flank do you want to move this creature to?',
            context: context,
            source: this.target.length > 0 ? this.target[0] : context.source,
            choices: ['Left', 'Right'],
            choiceHandler: choice => this.left = choice === 'Left'
        });
    }

    getEvent(card, context) {
        return super.createEvent('onMoveToFlank', { card: card, context: context }, () => {
            let cardIndex = card.controller.cardsInPlay.indexOf(card);
            if(this.left) {
                card.controller.cardsInPlay.splice(cardIndex, 1);
                card.controller.cardsInPlay.unshift(card);
            } else {
                card.controller.cardsInPlay.splice(cardIndex, 1);
                card.controller.cardsInPlay.push(card);
            }
        });
    }
}

module.exports = MoveToFlankAction;
