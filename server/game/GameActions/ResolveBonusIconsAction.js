const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class ResolveBonusIconsAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'resolveBonusIcons';
        this.effectMsg = "resolve {0}'s bonus icons";
    }

    findReplacementChain(player, originalIcon, chosenIcon) {
        // Find the full chain of replacements from originalIcon to chosenIcon
        // Returns array of {fromIcon, toIcon, source} objects
        if (originalIcon === chosenIcon) {
            return [];
        }

        const effects = player.effects.filter((e) => e.type === 'mayResolveBonusIconsAs');

        // BFS to find the shortest path from originalIcon to chosenIcon
        const queue = [[originalIcon]];
        const visited = new Set([originalIcon]);

        while (queue.length > 0) {
            const path = queue.shift();
            const currentIcon = path[path.length - 1];

            for (const effect of effects) {
                const value = effect.getValue(player);
                if (value.icon === 'any' || value.icon === currentIcon) {
                    const nextIcon = value.newIcon;
                    if (!visited.has(nextIcon)) {
                        const newPath = [...path, nextIcon];
                        if (nextIcon === chosenIcon) {
                            // Found the path, now build the chain with sources
                            const chain = [];
                            for (let i = 0; i < newPath.length - 1; i++) {
                                const fromIcon = newPath[i];
                                const toIcon = newPath[i + 1];
                                // Find the effect that enables this step
                                for (const eff of effects) {
                                    const val = eff.getValue(player);
                                    if (
                                        val.newIcon === toIcon &&
                                        (val.icon === 'any' || val.icon === fromIcon)
                                    ) {
                                        chain.push({
                                            fromIcon,
                                            toIcon,
                                            source: eff.context?.source
                                        });
                                        break;
                                    }
                                }
                            }
                            return chain;
                        }
                        visited.add(nextIcon);
                        queue.push(newPath);
                    }
                }
            }
        }

        return [];
    }

    getIconDescription(icon) {
        const descriptions = {
            amber: 'gain 1 amber',
            capture: 'capture 1 amber',
            damage: 'deal 1 damage',
            discard: 'discard a card',
            draw: 'draw a card',
            steal: 'steal 1 amber',
            token: 'make a token creature'
        };
        return descriptions[icon] || icon;
    }

    resolveIcon(context, event, icon, replacementChain = []) {
        // Print replacement chain messages
        for (const step of replacementChain) {
            if (step.source) {
                context.game.addMessage(
                    "{0} uses {1} to resolve {2}'s {3} bonus icon to {4}",
                    context.player,
                    step.source,
                    event.card,
                    step.fromIcon,
                    this.getIconDescription(step.toIcon)
                );
            }
        }

        switch (icon) {
            case 'amber':
                context.game.actions
                    .gainAmber({ bonus: true })
                    .resolve(context.player, context.game.getFrameworkContext(context.player));
                if (replacementChain.length === 0) {
                    context.game.addMessage(
                        "{0} gains an amber due to {1}'s bonus icon",
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
                    const hasChain = replacementChain.length > 0;
                    context.game.promptForSelect(context.game.activePlayer, {
                        activePromptTitle: 'Choose a creature to capture amber due to bonus icon',
                        cardType: 'creature',
                        controller: 'self',
                        source: event.card,
                        onSelect: (player, card) => {
                            context.game.actions
                                .capture({ bonus: true })
                                .resolve(card, context.game.getFrameworkContext(player));
                            if (!hasChain) {
                                context.game.addMessage(
                                    "{0} captures an amber on {1} due to {2}'s bonus icon",
                                    player,
                                    card,
                                    event.card
                                );
                            }
                            return true;
                        }
                    });
                }
                break;
            case 'damage':
                if (context.game.creaturesInPlay.length > 0) {
                    const hasChain = replacementChain.length > 0;
                    context.game.promptForSelect(context.game.activePlayer, {
                        activePromptTitle: 'Choose a creature to damage due to bonus icon',
                        cardType: 'creature',
                        source: event.card,
                        onSelect: (player, card) => {
                            context.game.actions
                                .dealDamage({ bonus: true })
                                .resolve(card, context.game.getFrameworkContext(player));
                            if (!hasChain) {
                                context.game.addMessage(
                                    "{0} deals 1 damage to {1} due to {2}'s bonus icon",
                                    player,
                                    card,
                                    event.card
                                );
                            }
                            return true;
                        }
                    });
                }
                break;
            case 'discard':
                if (context.player.hand.length > 0) {
                    const hasChain = replacementChain.length > 0;
                    context.game.promptForSelect(context.game.activePlayer, {
                        activePromptTitle: 'Choose a card to discard due to bonus icon',
                        controller: 'self',
                        location: 'hand',
                        source: event.card,
                        onSelect: (player, card) => {
                            context.game.actions
                                .discard({ chatMessage: false })
                                .resolve(card, context.game.getFrameworkContext(player));
                            if (!hasChain) {
                                context.game.addMessage(
                                    "{0} discards {1} due to {2}'s bonus icon",
                                    player,
                                    card,
                                    event.card
                                );
                            }
                            return true;
                        }
                    });
                }
                break;
            case 'draw':
                context.game.actions
                    .draw({ bonus: true })
                    .resolve(context.player, context.game.getFrameworkContext(context.player));
                if (replacementChain.length === 0) {
                    context.game.addMessage(
                        "{0} draws a card due to {1}'s bonus icon",
                        context.player,
                        event.card
                    );
                }
                break;
            case 'steal':
                if (context.player.opponent && context.player.opponent.amber > 0) {
                    context.game.actions
                        .steal()
                        .resolve(
                            context.player.opponent,
                            context.game.getFrameworkContext(context.player)
                        );
                    if (replacementChain.length === 0) {
                        context.game.addMessage(
                            "{0} steals an amber due to {1}'s bonus icon",
                            context.player,
                            event.card
                        );
                    }
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
                    if (replacementChain.length === 0) {
                        context.game.addMessage(
                            "{0} makes a token creature due to {1}'s bonus icon",
                            context.player,
                            event.card
                        );
                    }
                }
                break;
            default:
                context.game.addAlert(
                    'danger',
                    'Attempted to resolve unknown bonus icon type: {0}',
                    icon
                );
                break;
        }
    }

    getEvent(card, context) {
        return super.createEvent(
            EVENTS.onResolveBonusIcons,
            { card: card, context: context },
            (event) => {
                for (let icon of event.card.bonusIcons) {
                    const resolveCount = card.sumEffects('resolveBonusIconsAdditionalTime') + 1;

                    for (let rc = 0; rc < resolveCount; ++rc) {
                        let choices = [icon];
                        let mayResolveBonusIconsAsEffects =
                            context.player.getEffects('mayResolveBonusIconsAs');

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
                                handlers: choices.map((choice) => () => {
                                    const replacementChain =
                                        choice !== icon
                                            ? this.findReplacementChain(
                                                  context.player,
                                                  icon,
                                                  choice
                                              )
                                            : [];
                                    this.resolveIcon(context, event, choice, replacementChain);
                                }),
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

module.exports = ResolveBonusIconsAction;
