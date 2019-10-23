const CardGameAction = require('./CardGameAction');

class MoveOnBattlelineAction extends CardGameAction {
    setDefaultProperties() {
        this.left = false;
        this.deployIndex = undefined;
    }

    setup() {
        this.name = 'moveOnBattleline';
        this.targetType = ['creature'];
        this.effectMsg = 'put {0} into play';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        let card = this.target.length > 0 ? this.target[0] : context.source;
        let player = context.player;

        if(player.cardsInPlay.some(card => card.type === 'creature')) {
            context.game.promptForSelect(player, {
                source: card,
                activePromptTitle: 'Select a card to move this card next to',
                cardCondition: card => (card.location === 'play area') && card.controller === player && card.type === 'creature',
                onSelect: (p, card) => {
                    let choices = ['Left', 'Right'];

                    this.moveIndex = card.controller.cardsInPlay.indexOf(card);

                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Which side to you want to move this card to?',
                        context: context,
                        source: this.target.length > 0 ? this.target[0] : context.source,
                        choices: choices,
                        choiceHandler: choice => {
                            this.left = choice === 'Left';
                        }
                    });
                    return true;
                }
            });
        }
    }

    getEvent(card, context) {
        return super.createEvent('onCardMovedInBattleline', { card: card, context: context }, () => {
            let player;
            player = card.controller;

            player.moveCard(card, 'play area', { left: this.left, deployIndex: this.moveIndex });
        });
    }
}

module.exports = MoveOnBattlelineAction;
