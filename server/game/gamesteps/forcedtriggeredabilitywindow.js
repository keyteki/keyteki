const _ = require('underscore');

const BaseStep = require('./basestep.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class ForcedTriggeredAbilityWindow extends BaseStep {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game);
        this.choices = [];
        this.events = [];
        this.eventWindow = window;
        this.eventsToExclude = eventsToExclude;
        this.abilityType = abilityType;        
        this.currentPlayer = this.game.getFirstPlayer();
        this.resolvedAbilities = [];
    }

    continue() {
        this.game.currentAbilityWindow = this;
        if(this.eventWindow) {
            this.emitEvents();
        }

        if(this.filterChoices()) {
            this.game.currentAbilityWindow = null;
            return true;
        }

        return false;
    }

    addChoice(context) {
        if(!this.resolvedAbilities.some(resolved => resolved.ability === context.ability && resolved.event === context.event)) {
            this.choices.push(context);
        }
    }

    filterChoices() {
        if(this.choices.length === 0) {
            return true;
        }
        if(this.choices.length === 1 || !this.currentPlayer.optionSettings.orderForcedAbilities) {
            this.resolveAbility(this.choices[0]);
            return false;
        }
        if(_.uniq(this.choices, context => context.source).length === 1) {
            // All choices share a source
            this.promptBetweenAbilities(this.choices, false);
        } else {
            // Choose an card to trigger
            this.promptBetweenSources(this.choices);
        }
        return false;
    }

    promptBetweenSources(choices) {
        this.game.promptForSelect(this.currentPlayer, _.extend(this.getPromptForSelectProperties(), {
            cardCondition: card => _.any(choices, context => context.source === card),
            onSelect: (player, card) => {
                this.promptBetweenAbilities(choices.filter(context => context.source === card));
                return true;
            }
        }));
    }

    getPromptForSelectProperties() {
        return this.getPromptProperties();
    }

    getPromptProperties() {
        return {
            source: 'Triggered Abilities',
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events),
            waitingPromptTitle: 'Waiting for opponent'
        };
    }

    promptBetweenAbilities(choices, addBackButton = true) {
        let menuChoices = _.uniq(choices.map(context => context.ability.title));
        if(menuChoices.length === 1) {
            // this card has only one ability which can be triggered
            this.promptBetweenEventCards(choices, addBackButton);
            return;
        }
        // This card has multiple abilities which can be used in this window - prompt the player to pick one
        let handlers = menuChoices.map(title => (() => this.promptBetweenEventCards(choices.filter(context => context.ability.title === title))));
        if(addBackButton) {
            menuChoices.push('Back');
            handlers.push(() => this.promptBetweenSources(this.choices));
        }
        this.game.promptWithHandlerMenu(this.currentPlayer, _.extend(this.getPromptProperties(), {
            activePromptTitle: 'Which ability would you like to use?',
            choices: menuChoices,
            handlers: handlers
        }));
    }

    promptBetweenEventCards(choices, addBackButton = true) {
        if(_.uniq(choices, context => context.event.card).length === 1) {
            // The events which this ability can respond to only affect a single card
            this.promptBetweenEvents(choices, addBackButton);
            return;
        }
        // Several cards could be affected by this ability - prompt the player to choose which they want to affect
        this.game.promptForSelect(this.currentPlayer, _.extend(this.getPromptForSelectProperties(), {
            activePromptTitle: 'Select a card to affect',
            cardCondition: card => _.any(choices, context => context.event.card === card),
            buttons: addBackButton ? [{ text: 'Back', arg: 'back' }] : [],
            onSelect: (player, card) => {
                this.promptBetweenEvents(choices.filter(context => context.event.card === card));
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'back') {
                    this.promptBetweenSources(this.choices);
                    return true;
                }
            }
        }));
    }

    promptBetweenEvents(choices, addBackButton = true) {
        choices = _.uniq(choices, context => context.event);
        if(choices.length === 1) {
            // This card is only being affected by a single event which the chosen ability can respond to
            this.resolveAbility(choices[0]);
            return;
        }
        // Several events affect this card and the chosen ability can respond to more than one of them - prompt player to pick one
        let menuChoices = choices.map(context => TriggeredAbilityWindowTitles.getAction(context.event));
        let handlers = choices.map(context => (() => this.resolveAbility(context)));
        if(addBackButton) {
            menuChoices.push('Back');
            handlers.push(() => this.promptBetweenSources(this.choices));
        }
        this.game.promptWithHandlerMenu(this.currentPlayer, _.extend(this.getPromptProperties(), {
            activePromptTitle: 'Choose an event to respond to',
            choices: menuChoices,
            handlers: handlers
        }));
    }

    resolveAbility(context) {
        this.game.resolveAbility(context);
        this.resolvedAbilities.push({ ability: context.ability, event: context.event });
    }

    emitEvents() {
        this.choices = [];
        this.events = _.difference(this.eventWindow.events, this.eventsToExclude);
        _.each(this.events, event => {
            this.game.emit(event.name + ':' + this.abilityType, event, this);
        });
    }
}

module.exports = ForcedTriggeredAbilityWindow;
