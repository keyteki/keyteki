const CardGameAction = require('./CardGameAction');

class ResolveBonusIconsAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'resolveBonusIcons';
        this.effectMsg = "resolve {0}'s bonus icons";
    }

    getEvent(card, context) {
        return super.createEvent(
            'onResolveBonusIcons',
            { card: card, context: context },
            (event) => {
                for (let icon of event.card.bonusIcons) {
                    context.game.queueSimpleStep(() => {
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
                                handlers: choices.map((choice) => () => (icon = choice)),
                                context: context,
                                source: card
                            });
                        }
                    });

                    context.game.queueSimpleStep(() => {
                        if (icon === 'amber') {
                            context.game.actions
                                .gainAmber({ bonus: true })
                                .resolve(
                                    context.player,
                                    context.game.getFrameworkContext(context.player)
                                );
                            context.game.addMessage(
                                "{0} gains an amber due to {1}'s bonus icon",
                                context.player,
                                event.card
                            );
                        } else if (icon === 'draw') {
                            context.game.actions
                                .draw({ bonus: true })
                                .resolve(
                                    context.player,
                                    context.game.getFrameworkContext(context.player)
                                );
                            context.game.addMessage(
                                "{0} draws a card due to {1}'s bonus icon",
                                context.player,
                                event.card
                            );
                        } else if (icon === 'steal') {
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
                        } else if (icon === 'capture') {
                            if (
                                context.player.opponent &&
                                context.player.opponent.amber > 0 &&
                                context.player.creaturesInPlay.length > 0
                            ) {
                                context.game.promptForSelect(context.player, {
                                    activePromptTitle:
                                        'Choose a creature to capture amber due to bonus icon',
                                    cardType: 'creature',
                                    controller: 'self',
                                    source: card,
                                    onSelect: (player, card) => {
                                        context.game.actions
                                            .capture({ bonus: true })
                                            .resolve(
                                                card,
                                                context.game.getFrameworkContext(player)
                                            );
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
                        } else if (icon === 'damage') {
                            if (context.game.creaturesInPlay.length > 0) {
                                context.game.promptForSelect(context.player, {
                                    activePromptTitle:
                                        'Choose a creature to damage due to bonus icon',
                                    source: card,
                                    cardType: 'creature',
                                    onSelect: (player, card) => {
                                        context.game.actions
                                            .dealDamage({ bonus: true })
                                            .resolve(
                                                card,
                                                context.game.getFrameworkContext(player)
                                            );
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
                        }
                    });
                }
            }
        );
    }
}

module.exports = ResolveBonusIconsAction;
