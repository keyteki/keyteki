import CardGameAction from './CardGameAction.js';

class ResolveBonusIconsAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'resolveBonusIcons';
        this.effectMsg = "resolve {0}'s bonus icons";
    }

    resolveIcon(context, event, icon) {
        switch (icon) {
            case 'amber':
                context.game.actions
                    .gainAmber({ bonus: true })
                    .resolve(context.player, context.game.getFrameworkContext(context.player));
                context.game.addMessage(
                    "{0} gains an amber due to {1}'s bonus icon",
                    context.player,
                    event.card
                );
                break;
            case 'draw':
                context.game.actions
                    .draw({ bonus: true })
                    .resolve(context.player, context.game.getFrameworkContext(context.player));
                context.game.addMessage(
                    "{0} draws a card due to {1}'s bonus icon",
                    context.player,
                    event.card
                );
                break;
            case 'steal':
                if (context.player.opponent && context.player.opponent.amber > 0) {
                    context.game.actions
                        .steal()
                        .resolve(
                            context.player.opponent,
                            context.game.getFrameworkContext(context.player)
                        );
                    context.game.addMessage(
                        "{0} steals an amber due to {1}'s bonus icon",
                        context.player,
                        event.card
                    );
                }
                break;
            case 'capture':
                if (
                    context.player.opponent &&
                    context.player.opponent.amber > 0 &&
                    context.player.creaturesInPlay.length > 0
                ) {
                    context.game.promptForSelect(context.game.activePlayer, {
                        activePromptTitle: 'Choose a creature to capture amber due to bonus icon',
                        cardType: 'creature',
                        controller: 'self',
                        source: event.card,
                        onSelect: (player, card) => {
                            context.game.actions
                                .capture({ bonus: true })
                                .resolve(card, context.game.getFrameworkContext(player));
                            context.game.addMessage(
                                "{0} captures an amber on {1} due to {2}'s bonus icon",
                                player,
                                card,
                                event.card
                            );
                            return true;
                        }
                    });
                }
                break;
            case 'damage':
                if (context.game.creaturesInPlay.length > 0) {
                    context.game.promptForSelect(context.game.activePlayer, {
                        activePromptTitle: 'Choose a creature to damage due to bonus icon',
                        source: event.card,
                        cardType: 'creature',
                        onSelect: (player, card) => {
                            context.game.actions
                                .dealDamage({ bonus: true })
                                .resolve(card, context.game.getFrameworkContext(player));
                            context.game.addMessage(
                                "{0} deals 1 damage to {1} due to {2}'s bonus icon",
                                player,
                                card,
                                event.card
                            );
                            return true;
                        }
                    });
                }
                break;
            case 'discard':
                if (context.player.hand.length > 0) {
                    context.game.promptForSelect(context.game.activePlayer, {
                        activePromptTitle: 'Choose a card to discard due to bonus icon',
                        source: event.card,
                        location: 'hand',
                        controller: 'self',
                        onSelect: (player, card) => {
                            context.game.actions
                                .discard({ chatMessage: false })
                                .resolve(card, context.game.getFrameworkContext(player));
                            context.game.addMessage(
                                "{0} discards {1} due to {2}'s bonus icon",
                                player,
                                card,
                                event.card
                            );
                            return true;
                        }
                    });
                }
                break;
            case 'token':
                if (context.player.tokenCard) {
                    context.game.actions
                        .makeTokenCreature()
                        .resolve(
                            context.player.deck[0],
                            context.game.getFrameworkContext(context.player)
                        );
                    context.game.addMessage(
                        "{0} makes a token creature due to {1}'s bonus icon",
                        context.player,
                        event.card
                    );
                }
                break;
        }
    }

    getEvent(card, context) {
        return super.createEvent(
            'onResolveBonusIcons',
            { card: card, context: context },
            (event) => {
                for (let icon of event.card.bonusIcons) {
                    const resolveCount = card.sumEffects('resolveBonusIconsAdditionalTime') + 1;

                    for (let rc = 0; rc < resolveCount; ++rc) {
                        let choices = [icon];
                        let mayResolveBonusIconsAsEffects = context.player.getEffects(
                            'mayResolveBonusIconsAs'
                        );

                        if (mayResolveBonusIconsAsEffects) {
                            let noIconAdded = false;

                            while (!noIconAdded) {
                                noIconAdded = true;

                                for (let resolveBonusAsIcon of mayResolveBonusIconsAsEffects) {
                                    if (
                                        resolveBonusAsIcon.icon === 'any' ||
                                        choices.includes(resolveBonusAsIcon.icon)
                                    ) {
                                        if (!choices.includes(resolveBonusAsIcon.newIcon)) {
                                            choices.push(resolveBonusAsIcon.newIcon);
                                            noIconAdded = false;
                                        }
                                    }
                                }
                            }
                        }

                        if (choices.length > 1) {
                            context.game.promptWithHandlerMenu(context.player, {
                                activePromptTitle:
                                    'How do you wish to resolve this ' + icon + ' icon?',
                                choices: choices,
                                handlers: choices.map((choice) => () =>
                                    this.resolveIcon(context, event, choice)
                                ),
                                context: context,
                                source: card
                            });
                        } else {
                            context.game.queueSimpleStep(() => {
                                this.resolveIcon(context, event, icon);
                            });
                        }
                    }
                }
            }
        );
    }
}

export default ResolveBonusIconsAction;
