const UiPrompt = require('../uiprompt.js');
const DiscardAction = require('../../BaseActions/DiscardAction');
const RaiseTideAction = require('../../GameActions/RaiseTideAction');
const UseAction = require('../../GameActions/UseAction');
const ActivateProphecyAction = require('../../GameActions/ActivateProphecyAction');

class ActionWindow extends UiPrompt {
    onCardClicked(player, card) {
        if (player === this.game.activePlayer && card.controller === player) {
            if (card.location === 'play area') {
                let useAction = new UseAction({ ignoreHouse: false });
                let context = this.game.getFrameworkContext(player);
                if (useAction.canAffect(card, context)) {
                    useAction.resolve(card, context);
                    this.game.queueSimpleStep(() => this.checkForPhaseEnding());
                    return true;
                }
            } else if (card.use(player)) {
                this.game.queueSimpleStep(() => this.checkForPhaseEnding());
                return true;
            }
        }

        return false;
    }

    onCardDragged(player, card, from, to) {
        if (player === this.game.activePlayer && card.controller === player && from === 'hand') {
            if (to === 'play area') {
                let playAction = card
                    .getLegalActions(player)
                    .find((action) => action.title.includes('Play'));
                if (playAction) {
                    this.game.resolveAbility(playAction.createContext(player));
                }
            } else if (to === 'discard') {
                let discardAction = new DiscardAction(card);
                let context = discardAction.createContext(player);
                if (!discardAction.meetsRequirements(context, [])) {
                    this.game.resolveAbility(context);
                }
            } else {
                return false;
            }

            this.game.queueSimpleStep(() => this.checkForPhaseEnding());
            return true;
        }

        return false;
    }

    onTideClicked(player) {
        let raiseTideAction = new RaiseTideAction({
            showMessage: true,
            chainCost: 3 + player.sumEffects('modifyTideCost')
        });
        let context = this.game.getFrameworkContext(player);
        if (raiseTideAction.canAffect(player, context)) {
            this.game.promptWithHandlerMenu(player, {
                activePromptTitle: 'Raise the Tide?',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        raiseTideAction.resolve(player, context);
                        return true;
                    },
                    () => true
                ]
            });
        }

        return true;
    }

    onProphecyClicked(player, prophecyCard) {
        let activateProphecyAction = new ActivateProphecyAction({ prophecyCard: prophecyCard });
        let context = this.game.getFrameworkContext(player);
        context.source = prophecyCard;
        if (activateProphecyAction.canAffect(player, context)) {
            this.game.promptWithHandlerMenu(player, {
                activePromptTitle: 'Activate prophecy?',
                source: prophecyCard,
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        activateProphecyAction.resolve(player, context);
                        return true;
                    },
                    () => true
                ]
            });
        }

        return true;
    }

    checkForPhaseEnding() {
        if (this.game.endPhaseRightNow) {
            this.game.endPhaseRightNow = false;
            this.complete();
            return;
        }

        if (this.game.omegaCard) {
            this.game.addMessage(
                '{0} played {1} which has Omega, ending this step',
                this.game.activePlayer,
                this.game.omegaCard
            );
            this.complete();
        }
    }

    activePrompt() {
        let buttons = [{ text: 'End Turn', arg: 'done' }];

        return {
            menuTitle: 'Choose a card to play, discard or use',
            buttons: buttons,
            promptTitle: 'Play phase'
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    hasAvailableProphecies(player) {
        return player.prophecyCards.some((prophecyCard) =>
            player.canActivateProphecy(prophecyCard)
        );
    }

    menuCommand(player, choice) {
        if (choice === 'manual') {
            this.game.promptForSelect(this.game.activePlayer, {
                source: 'Manual Action',
                activePromptTitle: 'Which ability are you using?',
                location: 'any',
                controller: 'self',
                cardCondition: (card) => !card.facedown,
                onSelect: (player, card) => {
                    this.game.addMessage("{0} uses {1}'s ability", player, card);
                    return true;
                }
            });
            return true;
        }

        if (choice === 'done') {
            let cards = player.cardsInPlay.concat(player.hand);
            let hasPlayableCards = cards.some((card) => card.getLegalActions(player).length > 0);
            let hasAvailableProphecies = this.hasAvailableProphecies(player);

            if (hasPlayableCards || hasAvailableProphecies) {
                this.game.promptWithHandlerMenu(player, {
                    source: 'End Turn',
                    activePromptTitle: 'Are you sure you want to end your turn?',
                    choices: ['Yes', 'No'],
                    handlers: [() => this.complete(), () => true]
                });
            } else {
                this.complete();
            }

            return true;
        }
    }
}

module.exports = ActionWindow;
