const _ = require('underscore');
const uuid = require('uuid');

const BaseAbilityWindow = require('./baseabilitywindow.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class TriggeredAbilityWindow extends BaseAbilityWindow {
    constructor(game, properties) {
        super(game, properties);

        this.forceWindowPerPlayer = {};

        _.each(game.getPlayersInFirstPlayerOrder(), player => {
            if(this.isCancellableEvent(player)) {
                this.forceWindowPerPlayer[player.name] = true;
            }
        });
    }

    registerAbility(ability, event) {
        let context = ability.createContext(event);
        let player = context.player;
        let choiceTexts = ability.getChoices(context);

        _.each(choiceTexts, choiceText => {
            this.abilityChoices.push({
                id: uuid.v1(),
                player: player,
                ability: ability,
                card: ability.card,
                text: choiceText.text,
                choice: choiceText.choice,
                context: context
            });
        });
    }

    continue() {
        this.players = this.filterChoicelessPlayers(this.players || this.game.getPlayersInFirstPlayerOrder());

        if(this.players.length === 0 || _.size(this.abilityChoices) === 0 && !this.forceWindowPerPlayer[this.players[0].name]) {
            return true;
        }

        this.promptPlayer(this.players[0]);

        return false;
    }

    isTimerEnabled(player) {
        return !player.noTimer && player.user.settings.windowTimer !== 0;
    }

    isWindowEnabledForEvent(player, event) {
        let eventsEnabled = player.timerSettings.events;
        let abilitiesEnabled = player.timerSettings.abilities;

        if(event.name === 'onCardAbilityInitiated') {
            if(event.source.getType() === 'event') {
                return eventsEnabled;
            }

            return abilitiesEnabled;
        }

        // Must be onClaimApplied, which we tie to events setting
        return eventsEnabled;
    }

    isCancellableEvent(player) {
        let cancellableEvents = {
            onCardAbilityInitiated: 'cancelinterrupt',
            onClaimApplied: 'interrupt'
        };

        return this.isTimerEnabled(player) && _.any(this.events, event => {
            return event.player !== player && cancellableEvents[event.name] && cancellableEvents[event.name] === this.abilityType && this.isWindowEnabledForEvent(player, event);
        });
    }

    filterChoicelessPlayers(players) {
        return _.filter(players, player => this.isCancellableEvent(player) || _.any(this.abilityChoices, abilityChoice => this.eligibleChoiceForPlayer(abilityChoice, player)));
    }

    eligibleChoiceForPlayer(abilityChoice, player) {
        return abilityChoice.player === player && abilityChoice.ability.meetsRequirements(abilityChoice.context);
    }

    promptPlayer(player) {
        let choicesForPlayer = _.filter(this.abilityChoices, abilityChoice => this.eligibleChoiceForPlayer(abilityChoice, player));
        let buttons = _.map(choicesForPlayer, abilityChoice => {
            let title = abilityChoice.card.name;
            if(abilityChoice.text !== 'default') {
                title += ' - ' + abilityChoice.text;
            }

            return { text: title, method: 'chooseAbility', arg: abilityChoice.id, card: abilityChoice.card };
        });

        if(this.isCancellableEvent(player)) {
            buttons.push({ timer: true, method: 'pass', id: uuid.v1() });
            buttons.push({ text: 'I need more time', timerCancel: true });
            buttons.push({ text: 'Don\'t ask again until end of round', timerCancel: true, method: 'pass', arg: 'pauseRound' });
        }

        buttons.push({ text: 'Pass', method: 'pass' });
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events[0]),
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponents'
        });

        this.forceWindowPerPlayer[player.name] = false;
    }

    getChoicesForPlayer(player) {
        let choices = _.filter(this.abilityChoices, abilityChoice => {
            try {
                return this.eligibleChoiceForPlayer(abilityChoice, player);
            } catch(e) {
                this.abilityChoices = _.reject(this.abilityChoices, a => a === abilityChoice);
                this.game.reportError(e);
                return false;
            }
        });
        // Cards that have a maximum should only display a single choice by
        // title even if multiple copies are available to be triggered.
        return _.uniq(choices, choice => choice.ability.hasMax() ? choice.card.name : choice);
    }

    chooseAbility(player, id) {
        let choice = _.find(this.abilityChoices, ability => ability.id === id);

        if(!choice || choice.player !== player) {
            return false;
        }

        choice.context.choice = choice.choice;
        this.game.resolveAbility(choice.ability, choice.context);

        this.abilityChoices = _.reject(this.abilityChoices, ability => ability.card === choice.card);

        // Always rotate player order without filtering, in case an ability is
        // triggered that could then make another ability eligible after it is
        // resolved: e.g. Rains of Castamere into Wardens of the West
        this.players = this.rotatedPlayerOrder(player);

        return true;
    }

    pass(player, arg) {
        if(arg === 'pauseRound') {
            player.noTimer = true;
            player.resetTimerAtEndOfRound = true;
        }

        this.players.shift();
        return true;
    }

    rotatedPlayerOrder(player) {
        let players = this.game.getPlayersInFirstPlayerOrder();
        let splitIndex = players.indexOf(player);
        let beforePlayer = players.slice(0, splitIndex);
        let afterPlayer = players.slice(splitIndex + 1);
        return afterPlayer.concat(beforePlayer).concat([player]);
    }
}

module.exports = TriggeredAbilityWindow;
