const Constants = require('../../constants');
const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class ResolveBonusIconsAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'resolveBonusIcons';
        this.effectMsg = "resolve {0}'s bonus icons";

        // Ability replacements resolve to do an action rather than another bonus icon. They cannot be further replaced by bonus icon replacements.
        this.abilityReplacements = {
            steal: 'steal 1 amber',
            'token-creature': 'make a token creature'
        };

        // Display names for prompt buttons
        this.displayNames = {
            'token-creature': 'Token Creature'
        };
    }

    getDisplayName(icon) {
        return this.displayNames[icon] || icon;
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
        if (currentIcon in this.abilityReplacements) {
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
                        const bonusIcons = ['amber', 'capture', 'damage', 'draw', 'discard'];
                        if (bonusIcons.includes(replacement.newIcon)) {
                            context.game.addMessage(
                                "{0} uses {1} to resolve {2}'s {3} bonus icon as {4} {5} bonus icon",
                                context.player,
                                replacement.source,
                                event.card,
                                currentIcon,
                                'aeiou'.includes(replacement.newIcon.toLowerCase()) ? 'an' : 'a',
                                replacement.newIcon
                            );
                        } else if (this.abilityReplacements[replacement.newIcon]) {
                            context.game.addMessage(
                                "{0} uses {1} to resolve {2}'s {3} bonus icon to {4}",
                                context.player,
                                replacement.source,
                                event.card,
                                currentIcon,
                                this.abilityReplacements[replacement.newIcon]
                            );
                        } else {
                            context.game.addMessage(
                                "{0} uses {1} to resolve {2}'s {3} bonus icon as {4}",
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
                activePromptTitle: `How do you wish to resolve this ${currentIcon} bonus icon?`,
                choices: choices.map((c) => this.getDisplayName(c)),
                context: context,
                handlers: handlers,
                source: event.card
            });
        } else {
            // Only one choice (no valid replacements), just resolve
            this.resolveIcon(context, event, currentIcon);
        }
    }

    /**
     * Build the AbilityContext used to resolve a single bonus icon.
     *
     * The source is a BonusIconSource (not a Card), so card-cannot rules
     * that test the source's traits/type will not consider the bonus icon
     * to be "dealt by" the card on which it appears.  The source's `name`
     * still produces a useful chat label, and `controller` delegates to the
     * underlying card so any consumer of context.source.controller works.
     *
     * AbilityContext and BonusIconSource are lazy-required here to avoid a
     * load-time circular dependency between this file (loaded via
     * GameActions/index) and GameObject (which requires GameActions).
     */
    bonusIconContext(context, card, icon, player) {
        const AbilityContext = require('../AbilityContext');
        const BonusIconSource = require('../BonusIconSource');

        return new AbilityContext({
            game: context.game,
            player: player || context.player,
            source: new BonusIconSource(context.game, card, icon)
        });
    }

    resolveIcon(context, event, icon) {
        switch (icon) {
            case 'amber':
                context.game.actions
                    .gainAmber({ bonus: true })
                    .resolve(context.player, this.bonusIconContext(context, event.card, icon));
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
                                .resolve(
                                    card,
                                    this.bonusIconContext(context, event.card, icon, player)
                                );
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
                                .resolve(
                                    card,
                                    this.bonusIconContext(context, event.card, icon, player)
                                );
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
                                .resolve(
                                    card,
                                    this.bonusIconContext(context, event.card, icon, player)
                                );
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
                    .resolve(context.player, this.bonusIconContext(context, event.card, icon));
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
                            this.bonusIconContext(context, event.card, icon)
                        );
                    // No addMessage here: 'steal' only reaches resolveIcon as an
                    // abilityReplacement (e.g. Scrivener Favian), and that
                    // replacement flow emits its own resolution message.
                }
                break;
            case 'power':
                if (context.game.creaturesInPlay.length > 0) {
                    context.game.promptForSelect(context.game.activePlayer, {
                        activePromptTitle:
                            'Choose a creature to add a +1 power counter to due to bonus icon',
                        source: event.card,
                        cardType: 'creature',
                        onSelect: (player, card) => {
                            context.game.actions
                                .addPowerCounter({ amount: 1 })
                                .resolve(
                                    card,
                                    this.bonusIconContext(context, event.card, icon, player)
                                );
                            context.game.addMessage(
                                "{0} uses {1}'s power bonus icon to add a +1 power counter to {2}",
                                player,
                                event.card,
                                card
                            );
                            return true;
                        }
                    });
                }
                break;
            case 'token-creature':
                if (context.player.tokenCard) {
                    context.game.actions
                        .makeTokenCreature()
                        .resolve(
                            context.player.deck[0],
                            this.bonusIconContext(context, event.card, icon)
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
                    // House enhancements are not resolvable bonus icons
                    if (Constants.Houses.includes(icon.toLowerCase())) {
                        continue;
                    }

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
