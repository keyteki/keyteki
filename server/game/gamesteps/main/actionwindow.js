const UiPrompt = require('../uiprompt.js');

class ActionWindow extends UiPrompt {
    onCardClicked(player, card) {
        if(player === this.game.activePlayer && card.controller === player && card.use(player)) {
            this.game.queueSimpleStep(() => {
                if(this.game.cardsPlayed.some(card => card.hasKeyword('omega'))) {
                    this.complete();
                }
            });
            return true;
        }
        return false;
    }

    activePrompt() {
        let buttons = [
            { text: 'End Turn', arg: 'done' }
        ];

        return {
            menuTitle: 'Choose a card to play, discard or use',
            buttons: buttons,
            promptTitle: 'Play phase'
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    menuCommand(player, choice) {
        if(choice === 'manual') {
            this.game.promptForSelect(this.game.activePlayer, {
                source: 'Manual Action',
                activePromptTitle: 'Which ability are you using?',
                location: 'any',
                controller: 'self',
                cardCondition: card => !card.facedown,
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1}\'s ability', player, card);
                    return true;
                }
            });
            return true;
        }

        if(choice === 'done') {
            let cards = player.cardsInPlay.concat(player.hand);
            if(cards.some(card => card.getLegalActions(player).length > 0)) {
                this.game.promptWithHandlerMenu(player, {
                    source: 'End Turn',
                    activePromptTitle: 'Are you sure you want to end your turn?',
                    choices: ['Yes', 'No'],
                    handlers: [
                        () => this.complete(),
                        () => true
                    ]
                });
            } else {
                this.complete();
            }
            return true;
        }
    }
}

module.exports = ActionWindow;
