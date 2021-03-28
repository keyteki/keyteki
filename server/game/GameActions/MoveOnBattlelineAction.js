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
        let player = context.player.opponent;

        if (!player) {
            return;
        }

        if (player.cardsInPlay.some((card) => card.type === 'creature')) {
            context.game.promptForSelect(player, {
                source: card,
                activePromptTitle: 'Select a card to move this card next to',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === player &&
                    card.type === 'creature',
                onSelect: (p, card) => {
                    let choices = ['Left', 'Right'];

                    this.moveIndex = card.controller.cardsInPlay.indexOf(card);

                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Which side to you want to move this card to?',
                        context: context,
                        source: this.target.length > 0 ? this.target[0] : context.source,
                        choices: choices,
                        choiceHandler: (choice) => {
                            if (choice === 'Right') {
                                this.moveIndex++;
                            }

                            return true;
                        }
                    });
                    return true;
                }
            });
        }
    }

    getEvent(card, context) {
        return super.createEvent(
            'onCardMovedInBattleline',
            { card: card, context: context },
            () => {
                let player = card.controller;
                let cardIndex = player.cardsInPlay.indexOf(card);
                let cardInsertionIndex =
                    this.moveIndex > cardIndex ? this.moveIndex - 1 : this.moveIndex;

                player.cardsInPlay.splice(cardIndex, 1);
                player.cardsInPlay.splice(cardInsertionIndex, 0, card);
            }
        );
    }
}

module.exports = MoveOnBattlelineAction;
