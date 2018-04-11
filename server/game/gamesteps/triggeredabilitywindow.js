const _ = require('underscore');

const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class TriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game, abilityType, events) {
        super(game, abilityType, events);
        this.complete = false;
        this.prevPlayerPassed = false;
    }

    showCancelPrompt(player) {
        if(this.abilityType === 'cancelinterrupt') {
            return false;
        }
        return _.any(this.events, event => (
            event.name === 'onCardAbilityInitiated' && 
            (event.card.type === 'event' ? player.timerSettings.events : player.timerSettings.abilities) && 
            (event.context.player !== player || player.optionSettings.cancelOwnAbilities)
        ));
    }

    promptWithCancelPrompt(player) {
        this.game.promptWithMenu(player, this, {
            source: 'Triggered Abilities',
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events),
            controls: this.getAdditionalPromptControls(),
            waitingPromptTitle: 'Waiting for opponent',
            buttons: [
                { timer: true, method: 'pass' },
                { text: 'I need more time', timerCancel: true },
                { text: 'Don\'t ask again until end of round', timerCancel: true, method: 'pass', arg: 'pauseRound' },
                { text: 'Pass', method: 'pass' }
            ]
        });
    }

    pass(player, arg) {
        if(arg === 'pauseRound') {
            player.noTimer = true;
            player.resetTimerAtEndOfRound = true;
        }
        this.currentPlayer = this.currentPlayer.opponent;
        if(this.prevPlayerPassed || !this.currentPlayer) {
            this.complete = true;
        } else {
            this.prevPlayerPassed = true;
        }

        return true;
    }

    filterChoices() {
        if(this.complete || this.choices.length === 0) {
            return true;
        }

        if(!_.any(this.choices, context => context.player === this.currentPlayer)) {
            if(this.showCancelPrompt(this.currentPlayer)) {
                this.promptWithCancelPrompt(this.currentPlayer);
                return false;
            }
            this.pass();
            return this.filterChoices();
        }

        this.choices = _.filter(this.choices, context => context.player === this.currentPlayer);
        this.promptBetweenSources(this.choices);
        return false;
    }

    resolveAbility(context) {
        this.prevPlayerPassed = false;
        this.currentPlayer = this.currentPlayer.opponent || this.currentPlayer;
        super.resolveAbility(context);
    }

    getPromptForSelectProperties() {
        return _.extend(super.getPromptForSelectProperties(), {
            controls: this.getAdditionalPromptControls(),
            selectCard: this.currentPlayer.optionSettings.markCardsUnselectable,
            buttons: [{ text: 'Pass', arg: 'pass' }],
            onMenuCommand: (player, arg) => {
                this.pass(player, arg);
                return true;
            }
        });
    }

    getAdditionalPromptControls() {
        let controls = [];
        for(let event of this.events) {
            if(event.name === 'onCardAbilityInitiated' && event.allTargets.length > 0) {
                controls.push({
                    type: 'targeting',
                    source: event.card.getShortSummary(),
                    targets: event.allTargets.map(target => target.getShortSummary())
                });
            }
        }
        return controls;
    }
}

module.exports = TriggeredAbilityWindow;
