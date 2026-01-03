const _ = require('underscore');

const BaseStep = require('./basestep.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');
const Optional = require('../optional.js');
const { EVENTS } = require('../Events/types.js');

class ForcedTriggeredAbilityWindow extends BaseStep {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game);
        this.choices = [];
        this.deferredChoices = [];
        this.eventWindow = window;
        this.eventsToExclude = eventsToExclude;
        this.abilityType = abilityType;
        this.currentPlayer = this.game.activePlayer;
        this.resolvedAbilities = [];
        this.skippedAbilities = [];
        this.pressedDone = false;
        this.cancelled = false;
        this.autoResolve = false;
    }

    onCancel() {
        this.cancelled = true;
        return true;
    }

    continue() {
        if (this.cancelled) {
            return true;
        }

        this.game.currentAbilityWindow = this;

        if (this.eventWindow) {
            this.emitEvents();
        }

        if (this.filterChoices()) {
            this.game.currentAbilityWindow = null;
            return true;
        }

        return false;
    }

    addChoice(context) {
        if (
            !this.resolvedAbilities.some(
                (resolved) =>
                    resolved.ability === context.ability && resolved.event === context.event
            ) &&
            !this.skippedAbilities.some(
                (skipped) => skipped.ability === context.ability && skipped.event === context.event
            )
        ) {
            this.choices.push(context);
        }
    }

    addDeferredChoice(context) {
        // Deferred choices are destroyed abilities whose condition currently fails
        // but might pass if another ability changes the game state first.
        // They are only added to choices if there are other valid choices.
        if (
            !this.resolvedAbilities.some(
                (resolved) =>
                    resolved.ability === context.ability && resolved.event === context.event
            ) &&
            !this.skippedAbilities.some(
                (skipped) => skipped.ability === context.ability && skipped.event === context.event
            ) &&
            !this.deferredChoices.some(
                (deferred) =>
                    deferred.ability === context.ability && deferred.event === context.event
            )
        ) {
            this.deferredChoices.push(context);
        }
    }

    filterChoices() {
        // If there are valid choices and deferred choices, add the deferred ones
        // so the player can choose the order. The deferred abilities' conditions
        // might pass after another ability changes the game state.
        if (this.choices.length > 0 && this.deferredChoices.length > 0) {
            this.choices = this.choices.concat(this.deferredChoices);
            this.deferredChoices = [];
        }

        if (this.choices.length === 0 || this.pressedDone) {
            return true;
        }

        // Re-check conditions for destroyed abilities that were added with a 'condition' failure.
        // This filters out abilities whose condition still fails after other abilities have resolved.
        // For example, Captain No-Beard Evil Twin's capture ability should be filtered out if
        // opponent still has 0 amber after other destroyed abilities resolved.
        // We only do this after at least one ability has resolved, so that on the first pass
        // we allow the player to choose the order (e.g., Flint's Stash before KeyFrog).
        if (this.resolvedAbilities.length > 0) {
            let stillValid = [];
            for (let context of this.choices) {
                if (context.ability.properties && context.ability.properties.destroyed) {
                    if (context.ability.meetsRequirements(context) === '') {
                        stillValid.push(context);
                    } else {
                        // Track skipped abilities so they don't get re-added by emitEvents
                        this.skippedAbilities.push({
                            ability: context.ability,
                            event: context.event
                        });
                    }
                } else {
                    stillValid.push(context);
                }
            }
            this.choices = stillValid;

            if (this.choices.length === 0) {
                return true;
            }
        }

        let autoResolveChoice = this.choices.find((context) => context.ability.autoResolve);
        if (autoResolveChoice) {
            this.resolveAbility(autoResolveChoice);
            return false;
        }

        this.noOptionalChoices = this.choices.every((context) =>
            Optional.EvalOptional(context, !context.ability.optional)
        );
        if (
            this.noOptionalChoices &&
            (this.autoResolve ||
                this.choices.length === 1 ||
                !this.currentPlayer.optionSettings.orderForcedAbilities)
        ) {
            this.resolveAbility(this.choices[0]);
            return false;
        }

        // Choose a card to trigger
        this.promptBetweenSources(this.choices);
        return false;
    }

    promptBetweenSources(choices) {
        let lastingTriggers = _.uniq(
            choices.filter(
                (context) =>
                    context.ability.isLastingAbilityTrigger ||
                    context.source.location === 'being played'
            ),
            (context) => context.ability
        );
        let lastingTriggerCards = lastingTriggers.map((context) => context.source);
        if (lastingTriggerCards.length === 0) {
            if (
                choices.some(
                    (context) =>
                        !Optional.EvalOptional(context, context.ability.optional) &&
                        !Optional.EvalOptional(context, context.ability.optionalTarget)
                )
            ) {
                let sourceCount = 0;
                for (const card of this.game.cardsInPlay) {
                    if (choices.some((context) => context.source === card)) {
                        sourceCount++;
                    }
                    for (const upgrade of card.upgrades) {
                        if (choices.some((context) => context.source === upgrade)) {
                            sourceCount++;
                        }
                    }
                    if (sourceCount > 1) {
                        break;
                    }
                }

                if (sourceCount === 1) {
                    this.promptBetweenAbilities(choices, false);
                    return;
                }
            }
        }

        let buttons = lastingTriggerCards.map((card, i) => ({
            text: '{{card}}',
            card: card,
            values: { card: card.name },
            arg: i.toString()
        }));

        let defaultProperties = this.getPromptForSelectProperties();
        let properties = Object.assign({}, defaultProperties);
        properties.buttons = buttons.concat(defaultProperties.buttons);
        properties.cardCondition = (card) =>
            !lastingTriggerCards.includes(card) &&
            choices.some((context) => context.source === card);
        properties.onSelect = (player, card) => {
            this.promptBetweenAbilities(choices.filter((context) => context.source === card));
            return true;
        };

        // Add prophecy as a card type if one of the choices is an active prophecy
        if (choices.some((context) => context.source.activeProphecy)) {
            properties.cardType = properties.cardType.concat('prophecy');
        }

        properties.onMenuCommand = (player, arg) => {
            if (defaultProperties.onMenuCommand(player, arg)) {
                return true;
            }

            this.promptBetweenAbilities(
                choices.filter((context) => context.source === lastingTriggerCards[parseInt(arg)])
            );
            return true;
        };

        this.game.promptForSelect(this.currentPlayer, properties);
    }

    getPromptForSelectProperties() {
        let buttons = [];
        if (
            this.choices.every(
                (context) =>
                    Optional.EvalOptional(context, context.ability.optional) ||
                    Optional.EvalOptional(context, context.ability.optionalTarget)
            )
        ) {
            buttons.push({ text: 'Done', arg: 'done' });
        } else if (this.noOptionalChoices) {
            buttons.push({ text: 'Autoresolve', arg: 'autoresolve' });
        }

        let properties = {
            buttons: buttons,
            location: 'any',
            cardType: ['action', 'artifact', 'creature', 'upgrade'],
            onCancel: () => {
                return this.onCancel();
            },
            onMenuCommand: (player, arg) => {
                if (arg === 'done') {
                    this.pressedDone = true;
                    return true;
                }
                if (arg === 'autoresolve') {
                    this.autoResolve = true;
                    return true;
                }
                return false;
            }
        };
        return Object.assign(properties, this.getPromptProperties());
    }

    getPromptProperties() {
        return {
            source: 'Triggered Abilities',
            controls: this.getPromptControls(),
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(
                this.abilityType,
                this.choices.map((context) => context.event)
            ),
            waitingPromptTitle: 'Waiting for opponent'
        };
    }

    getPromptControls() {
        let map = new Map();
        for (let context of this.choices) {
            if (context && context.source) {
                let targets = map.get(context.source) || [];
                let event = context.event;
                if (context.target) {
                    targets = targets.concat(context.target);
                } else if (event.card && event.card !== context.source) {
                    targets = targets.concat(event.card);
                } else if (event.card) {
                    targets = targets.concat(event.card);
                }

                map.set(context.source, _.uniq(targets));
            }
        }

        return [...map.entries()].map(([source, targets]) => ({
            type: 'targeting',
            source: source.getShortSummary(),
            targets: targets.map((target) => target.getShortSummary())
        }));
    }

    getEventName(context) {
        const event = context.event;
        const ability = context.ability;
        if (event) {
            if (event.name === EVENTS.onCardPlayed && !ability.properties.play) {
                return ability.properties.reap
                    ? ' (reap)'
                    : ability.properties.fight
                    ? ' (fight)'
                    : '';
            }
            if (event.name === EVENTS.onFight && !ability.properties.fight) {
                return ability.properties.reap
                    ? ' (reap)'
                    : ability.properties.play
                    ? ' (play)'
                    : '';
            }
            if (event.name === EVENTS.onReap && !ability.properties.reap) {
                return ability.properties.fight
                    ? ' (fight)'
                    : ability.properties.play
                    ? ' (play)'
                    : '';
            }
        }

        return '';
    }

    getAbilityButton(context) {
        if (context.ability.title) {
            return { key: context.ability.title, text: context.ability.title };
        }

        const eventToAppend = this.getEventName(context);
        if (context.ability.printedAbility) {
            return {
                key: context.source.name + eventToAppend,
                text: '{{card}}' + eventToAppend,
                card: context.source,
                values: { card: context.source.name }
            };
        }

        let generatingEffectSource = this.game.getEffectSource(context);
        if (generatingEffectSource) {
            return {
                key: generatingEffectSource.name + eventToAppend,
                text: '{{card}}' + eventToAppend,
                card: generatingEffectSource,
                values: { card: generatingEffectSource.name }
            };
        }

        return {
            key: context.source.name + eventToAppend,
            text: '{{card}}' + eventToAppend,
            card: context.source,
            values: { card: context.source.name }
        };
    }

    promptBetweenAbilities(choices, addBackButton = true) {
        let menuChoices = _.uniq(
            choices.map((context) => this.getAbilityButton(context)),
            (button) => button.key
        );
        if (menuChoices.length === 1) {
            // this card has only one ability which can be triggered
            this.promptBetweenEventCards(choices, addBackButton);
            return;
        }

        // This card has multiple abilities which can be used in this window - prompt the player to pick one
        let handlers = menuChoices.map((button) => () =>
            this.promptBetweenEventCards(
                choices.filter((context) => this.getAbilityButton(context).key === button.key)
            )
        );

        if (this.noOptionalChoices) {
            menuChoices.push('Autoresolve');
            handlers.push(() => {
                this.autoResolve = true;
                return true;
            });
        }

        if (addBackButton) {
            menuChoices.push('Back');
            handlers.push(() => this.promptBetweenSources(this.choices));
        } else if (this.game.manualMode) {
            menuChoices.push('Cancel Prompt');
            handlers.push(() => this.onCancel());
        }

        this.game.promptWithHandlerMenu(
            this.currentPlayer,
            _.extend(this.getPromptProperties(), {
                activePromptTitle: 'Which ability would you like to use?',
                choices: menuChoices,
                handlers: handlers
            })
        );
    }

    promptBetweenEventCards(choices, addBackButton = true) {
        if (_.uniq(choices, (context) => context.event.card).length === 1) {
            // The events which this ability can respond to only affect a single card
            this.promptBetweenEvents(choices, addBackButton);
            return;
        }

        // Several cards could be affected by this ability - prompt the player to choose which they want to affect
        this.game.promptForSelect(
            this.currentPlayer,
            _.extend(this.getPromptForSelectProperties(), {
                activePromptTitle: 'Select a card to affect',
                cardCondition: (card) => _.any(choices, (context) => context.event.card === card),
                buttons: addBackButton
                    ? [{ text: 'Back', arg: 'back' }]
                    : [{ text: 'Autoresolve', arg: 'autoresolve' }],
                onSelect: (player, card) => {
                    this.promptBetweenEvents(
                        choices.filter((context) => context.event.card === card)
                    );
                    return true;
                },
                onMenuCommand: (player, arg) => {
                    if (arg === 'back') {
                        this.promptBetweenSources(this.choices);
                        return true;
                    }
                    if (arg === 'autoresolve') {
                        this.autoResolve = true;
                        return true;
                    }
                }
            })
        );
    }

    promptBetweenEvents(choices, addBackButton = true) {
        choices = _.uniq(choices, (context) => context.event);
        if (choices.length === 1) {
            // This card is only being affected by a single event which the chosen ability can respond to
            this.resolveAbility(choices[0]);
            return;
        }

        // Several events affect this card and the chosen ability can respond to more than one of them - prompt player to pick one
        let menuChoices = choices.map((context) =>
            TriggeredAbilityWindowTitles.getAction(context.event)
        );
        let handlers = choices.map((context) => () => this.resolveAbility(context));
        if (addBackButton) {
            menuChoices.push('Back');
            handlers.push(() => this.promptBetweenSources(this.choices));
        }

        this.game.promptWithHandlerMenu(
            this.currentPlayer,
            _.extend(this.getPromptProperties(), {
                activePromptTitle: 'Choose an event to respond to',
                choices: menuChoices,
                handlers: handlers
            })
        );
    }

    resolveAbility(context) {
        this.game.resolveAbility(context);
        if (context.ability.isLastingAbilityTrigger && !context.ability.multipleTrigger) {
            context.ability.unregisterEvents();
        }
        this.resolvedAbilities.push({ ability: context.ability, event: context.event });
    }

    emitEvents() {
        this.choices = [];
        let events = _.difference(
            this.eventWindow.event.getSimultaneousEvents(),
            this.eventsToExclude
        );
        _.each(events, (event) => {
            this.game.emit(event.name + ':' + this.abilityType, event, this);
        });
    }
}

module.exports = ForcedTriggeredAbilityWindow;
