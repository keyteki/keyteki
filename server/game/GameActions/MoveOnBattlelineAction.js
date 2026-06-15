const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class MoveOnBattlelineAction extends CardGameAction {
    setDefaultProperties() {
        this.left = false;
        this.deployIndex = undefined;
        this.player = null;
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

        const card = this.target.length > 0 ? this.target[0] : context.source;
        const player = this.player || context.player.opponent;

        if (!player) {
            return;
        }

        if (player.cardsInPlay.some((card) => card.type === 'creature')) {
            context.game.promptForSelect(context.game.activePlayer, {
                source: card,
                activePromptTitle: 'Select a card to move this card next to',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === player &&
                    card.type === 'creature',
                onSelect: (p, card) => {
                    const choices = ['Left', 'Right'];

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
            EVENTS.onCardMovedInBattleline,
            { card: card, context: context },
            () => {
                const player = card.controller;
                const cardIndex = player.cardsInPlay.indexOf(card);
                const cardInsertionIndex =
                    this.moveIndex > cardIndex ? this.moveIndex - 1 : this.moveIndex;

                player.cardsInPlay.splice(cardIndex, 1);
                player.cardsInPlay.splice(cardInsertionIndex, 0, card);
            }
        );
    }
}

module.exports = MoveOnBattlelineAction;
