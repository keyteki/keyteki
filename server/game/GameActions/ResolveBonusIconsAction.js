const CardGameAction = require('./CardGameAction');

class ResolveBonusIconsAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'resolveBonusIcons';
        this.effectMsg = 'resolve {0}\'s bonus icons';
    }

    getEvent(card, context) {
        return super.createEvent('onResolveBonusIcons', { card: card, context: context }, event => {
            for(let icon of event.card.bonusIcons) {
                context.game.queueSimpleStep(() => {
                    const mayResolveAsCapture = context.player.anyEffect('mayResolveBonusIconsAsCapture');
                    const mayStealInsteadOfCapture = context.player.anyEffect('mayResolveCaptureIconsAsSteal');
                    if(mayResolveAsCapture && icon !== 'capture' || mayStealInsteadOfCapture && icon === 'capture') {
                        let choices = [icon];
                        if(mayResolveAsCapture && icon !== 'capture') {
                            choices.push('capture');
                        }

                        if(mayStealInsteadOfCapture) {
                            choices.push('steal');
                        }

                        context.player.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'How do you wish to resolve this ' + icon + ' icon?',
                            choices: choices,
                            handlers: choices.map(choice => () => icon = choice),
                            context: context
                        });
                    }
                });
                context.game.queueSimpleStep(() => {
                    if(icon === 'amber') {
                        context.game.actions.gainAmber({ bonus: true }).resolve(context.player, context.game.getFrameworkContext(context.player));
                        context.game.addMessage('{0} gains an amber due to {1}\'s bonus icon', context.player, event.card);
                    } else if(icon === 'draw') {
                        context.game.actions.draw({ bonus: true }).resolve(context.player, context.game.getFrameworkContext(context.player));
                        context.game.addMessage('{0} draws a card due to {1}\'s bonus icon', context.player, event.card);
                    } else if(icon === 'steal') {
                        context.game.actions.steal().resolve(context.player.opponent, context.game.getFrameworkContext(context.player));
                        context.game.addMessage('{0} steals an amber due to {1}\'s bonus icon', context.player, event.card);
                    } else if(icon === 'capture') {
                        context.game.promptForSelect(context.player, {
                            activePromptTitle: 'Choose a creature to capture amber due to bonus icon',
                            cardType: 'creature',
                            controller: 'self',
                            onSelect: (player, card) => {
                                context.game.actions.capture({ bonus: true }).resolve(card, context.game.getFrameworkContext(player));
                                context.game.addMessage('{0} captures an amber on {1} due to {2}\'s bonus icon', player, card, event.card);
                                return true;
                            }
                        });
                    } else if(icon === 'damage') {
                        context.game.promptForSelect(context.player, {
                            activePromptTitle: 'Choose a creature to damage due to bonus icon',
                            cardType: 'creature',
                            onSelect: (player, card) => {
                                context.game.actions.dealDamage({ bonus: true }).resolve(card, context.game.getFrameworkContext(player));
                                context.game.addMessage('{0} deals 1 damage to {1} due to {2}\'s bonus icon', player, card, event.card);
                                return true;
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = ResolveBonusIconsAction;
