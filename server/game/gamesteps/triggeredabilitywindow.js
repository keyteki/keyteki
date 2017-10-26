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

        if(_.all(this.events, event => event.cancelled) || this.players.length === 0 || _.size(this.abilityChoices) === 0 && !this.forceWindowPerPlayer[this.players[0].name]) {
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

        return !_.any(this.abilityChoices, abilityChoice => this.eligibleChoiceForPlayer(abilityChoice, player)) && this.isTimerEnabled(player) && _.any(this.events, event => {
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
        let cards = _.map(choicesForPlayer, abilityChoice => abilityChoice.card);

        let buttons = [];
        if(this.isCancellableEvent(player)) {
            buttons.push({ timer: true, method: 'pass', id: uuid.v1() });
            buttons.push({ text: 'I need more time', timerCancel: true });
            buttons.push({ text: 'Don\'t ask again until end of round', timerCancel: true, method: 'pass', arg: 'pauseRound' });
        }

        buttons.push({ text: 'Pass', method: 'pass' });
        this.game.promptForSelect(player, {
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events[0]),
            buttons: buttons,
            controls: this.getAdditionalPromptControls(),
            waitingPromptTitle: 'Waiting for opponent',
            cardCondition: card => cards.includes(card),
            onMenuCommand: (player, arg) => {
                this.pass(player, arg);
                return true;
            },
            onSelect: (player, card) => {
                let cardChoices = _.filter(choicesForPlayer, abilityChoice => abilityChoice.card === card);
                if(cardChoices.length === 1) {
                    let choice = _.find(this.abilityChoices, a => a.id === cardChoices[0].id);
                    this.game.resolveAbility(choice.ability, choice.context);
                    this.abilityChoices = _.reject(this.abilityChoices, a => a.id === cardChoices[0].id);
                    this.players = this.rotatedPlayerOrder(player);
                    return true;
                }
                this.game.promptWithHandlerMenu(player, {
                    choices: _.map(cardChoices, abilityChoice => abilityChoice.ability.title),
                    handlers: _.map(cardChoices, abilityChoice => {
                        return () => {
                            let choice = _.find(this.abilityChoices, a => a.id === abilityChoice.id);
                            this.game.resolveAbility(choice.ability, choice.context);
                            this.abilityChoices = _.reject(this.abilityChoices, a => a.id === abilityChoice.id);
                            this.players = this.rotatedPlayerOrder(player);
                        };
                    })
                });
                return true;
            }
        });

        this.forceWindowPerPlayer[player.name] = false;
    }

    getAdditionalPromptControls() {
        let controls = [];
        for(let event of this.events) {
            if(event.name === 'onCardAbilityInitiated' && event.targets.length > 0) {
                controls.push({
                    type: 'targeting',
                    source: event.source.getShortSummary(),
                    targets: event.targets.map(target => target.getShortSummary())
                });
            }
        }
        return controls;
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
