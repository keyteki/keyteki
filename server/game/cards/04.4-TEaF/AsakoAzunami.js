const DrawCard = require('../../drawcard.js');

class AsakoAzunami extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Bow and ready two characters instead of the water effect',
            when: {
                onResolveRingElement: (event, context) => event.ring.element === 'water' && event.player === context.player
            },
            effect: 'replace the water ring effect with bowing and readying two characters',
            handler: context => context.event.replaceHandler(() => {
                let eventWindow;
                let bowGameAction = ability.actions.bow();
                let readyGameAction = ability.actions.ready();
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose a character to bow',
                    optional: true,
                    context: context,
                    gameAction: bowGameAction,
                    targets: true,
                    onCancel: player => this.game.addMessage('{0} chooses not to bow a character', player),
                    onSelect: (player, card) => {
                        eventWindow.addEvent(bowGameAction.getEvent(card, context));
                        this.game.addMessage('{0} chooses to bow {1} with {2}\'s effect', player, card, context.source);
                        return true;
                    }
                });
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose a character to ready',
                    optional: true,
                    context: context,
                    gameAction: readyGameAction,
                    targets: true,
                    onCancel: player => this.game.addMessage('{0} chooses not to ready a character', player),
                    onSelect: (player, card) => {
                        eventWindow.addEvent(readyGameAction.getEvent(card, context));
                        this.game.addMessage('{0} chooses to ready {1} with {2}\'s effect', player, card, context.source);
                        return true;
                    }
                });
                eventWindow = this.game.openEventWindow([]);
            })
        });
    }
}

AsakoAzunami.id = 'asako-azunami';

module.exports = AsakoAzunami;
