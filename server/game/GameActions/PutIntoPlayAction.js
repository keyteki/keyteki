const CardGameAction = require('./CardGameAction');

class PutIntoPlayAction extends CardGameAction {
    setDefaultProperties() {
        this.left = false;
    }

    setup() {
        this.name = 'putIntoPlay';
        this.targetType = ['creature', 'artifact'];
        this.effectMsg = 'put {0} into play';
    }

    canAffect(card, context) {
        if(!context || !super.canAffect(card, context)) {
            return false;
        } else if(!context.player) {
            return false;
        } else if(card.location === 'play area') {
            return false;
        }
        return true;
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        if(context.player.cardsInPlay.some(card => card.type === 'creature')) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Which flank do you want to place this creature on?',
                context: context,
                choices: ['Left', 'Right'],
                choiceHandler: choice => this.left = choice === 'Left'
            });
        }
    }

    getEvent(card, context) {
        return super.createEvent('onCardEntersPlay', { card: card, context: context }, () => context.player.moveCard(card, 'play area', { left: this.left }));
    }
}

module.exports = PutIntoPlayAction;
