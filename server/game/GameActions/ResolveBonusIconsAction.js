const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class ResolveBonusIconsAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'resolveBonusIcons';
        this.effectMsg = "resolve {0}'s bonus icons";

        // Terminal replacements resolve to actions rather than icons - they cannot be further replaced
        this.terminalReplacements = {
            steal: 'steal 1 amber',
            token: 'make a token creature'
        };
    }

    getAvailableReplacements(player, currentIcon, usedSources) {
        // Returns array of {newIcon, source, effect} for replacements available from currentIcon
        // Filters out effects whose source has already been used in this chain
        const effects = player.effects.filter((e) => e.type === 'mayResolveBonusIconsAs');
        const replacements = [];

        for (const effect of effects) {
            const source = effect.context?.source;
            // Skip if this source has already been used in this chain
            if (source && usedSources.has(source)) {
                continue;
            }
            const value = effect.getValue(player);
            if (value.icon === 'any' || value.icon === currentIcon) {
                replacements.push({
                    effect,
                    newIcon: value.newIcon,
                    source
                });
            }
        }

        return replacements;
    }

    promptForIconResolution(context, event, currentIcon, originalIcon, usedSources = new Set()) {
        // Terminal replacements are actions, not icons and can no longer be
        // chained - eg Amphora Capture can be replaced by Scrivener Favian, but
        // not vice versa
        if (currentIcon in this.terminalReplacements) {
            this.resolveIcon(context, event, currentIcon);
            return;
        }

        const replacements = this.getAvailableReplacements(
            context.player,
            currentIcon,
            usedSources
        );

        if (replacements.length === 0) {
            // No more replacements available, resolve the icon
            this.resolveIcon(context, event, currentIcon);
            return;
        }

        // Build choices: current icon + all possible replacements
        const choices = [currentIcon];
        const handlers = [() => this.resolveIcon(context, event, currentIcon)];

        for (const replacement of replacements) {
            if (!choices.includes(replacement.newIcon)) {
                choices.push(replacement.newIcon);
                handlers.push(() => {
                    // Print the replacement message
                    if (replacement.source) {
                        if (this.terminalReplacements[replacement.newIcon]) {
                            context.game.addMessage(
                                "{0} uses {1} to resolve {2}'s {3} bonus icon to {4}",
                                context.player,
                                replacement.source,
                                event.card,
                                currentIcon,
                                this.terminalReplacements[replacement.newIcon]
                            );
                        } else {
                            context.game.addMessage(
                                "{0} uses {1} to resolve {2}'s {3} bonus icon as a {4} bonus icon",
                                context.player,
                                replacement.source,
                                event.card,
                                currentIcon,
                                replacement.newIcon
                            );
                        }
                    }
                    // Mark this source as used so it can't be used again in this chain
                    const newUsedSources = new Set(usedSources);
                    if (replacement.source) {
                        newUsedSources.add(replacement.source);
                    }
                    // Continue prompting with the new icon
                    this.promptForIconResolution(
                        context,
                        event,
                        replacement.newIcon,
                        newUsedSources
                    );
                });
            }
        }

        if (choices.length > 1) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle:
                    'How do you wish to resolve this ' + currentIcon + ' bonus icon?',
                choices: choices,
                context: context,
                handlers: handlers,
                source: event.card
            });
        } else {
            // Only one choice (no valid replacements), just resolve
            this.resolveIcon(context, event, currentIcon);
        }
    }

    resolveIcon(context, event, icon) {
        switch (icon) {
            case 'amber':
                context.game.actions
                    .gainAmber({ bonus: true })
                    .resolve(context.player, context.game.getFrameworkContext(context.player));
                context.game.addMessage(
                    "{0} uses {1}'s amber bonus icon to gain 1 amber",
                    context.player,
                    event.card
                );
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
                                "{0} uses {1}'s capture bonus icon to capture 1 amber onto {2}",
                                player,
                                event.card,
                                card
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
                        cardType: 'creature',
                        source: event.card,
                        onSelect: (player, card) => {
                            context.game.actions
                                .dealDamage({ bonus: true })
                                .resolve(card, context.game.getFrameworkContext(player));
                            context.game.addMessage(
                                "{0} uses {1}'s damage bonus icon to deal 1 damage to {2}",
                                player,
                                event.card,
                                card
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
                        controller: 'self',
                        location: 'hand',
                        source: event.card,
                        onSelect: (player, card) => {
                            context.game.actions
                                .discard({ chatMessage: false })
                                .resolve(card, context.game.getFrameworkContext(player));
                            context.game.addMessage(
                                "{0} uses {1}'s discard bonus icon to discard {2}",
                                player,
                                event.card,
                                card
                            );
                            return true;
                        }
                    });
                }
                break;
            case 'draw':
                context.game.actions
                    .draw({ bonus: true })
                    .resolve(context.player, context.game.getFrameworkContext(context.player));
                context.game.addMessage(
                    "{0} uses {1}'s draw bonus icon to draw a card",
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
                        "{0} uses {1}'s steal bonus icon to steal 1 amber",
                        context.player,
                        event.card
                    );
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
                        "{0} uses {1}'s token bonus icon to make a token creature",
                        context.player,
                        event.card
                    );
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
                for (const icon of event.card.bonusIcons) {
                    const resolveCount = card.sumEffects('resolveBonusIconsAdditionalTime') + 1;

                    for (let rc = 0; rc < resolveCount; ++rc) {
                        context.game.queueSimpleStep(() => {
                            this.promptForIconResolution(context, event, icon);
                        });
                    }
                }
            }
        );
    }
}

module.exports = ResolveBonusIconsAction;
