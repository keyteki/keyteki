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
        this.effectMsg = 'moved {0} to flank';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        
        let card = this.target.length > 0 ? this.target[0] : context.source;
        let player = this.myControl ? context.player : card.controller;

        if(player.cardsInPlay.some(card => card.type === 'creature')) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Which flank do you want to move this creature to?',
                context: context,
                source: this.target.length > 0 ? this.target[0] : context.source,
                choices: ['Left', 'Right'],
                choiceHandler: choice => this.left = choice === 'Left'
            });
        }
    }

    getEvent(card, context) {
        return super.createEvent('onMoveToFlank', { card: card, context: context }, () => {
            let cardIndex = card.controller.cardsInPlay.indexOf(card);
            if(this.left) {
                this.origin.controller.cardsInPlay.splice(cardIndex, 1);
                this.origin.controller.cardsInPlay.unshift(card);
            }
            else{
                this.origin.controller.cardsInPlay.splice(cardIndex, 1);
                this.origin.controller.cardsInPlay.push(card);
            }
        });
    }
}

module.exports = MoveToFlankAction;