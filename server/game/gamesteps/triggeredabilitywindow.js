const _ = require('underscore');

const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class TriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game, abilityType, window, eventsToExclude);
        this.complete = false;
        this.prevPlayerPassed = false;
    }

    showCancelPrompt(player) {
        // Cancel prompts are only shown in cancel windows
        if(this.abilityType !== 'cancelinterrupt') {
            return false;
        }
        // Show a cancel prompt if we're in Step 6, the player has the approriate setting, and there's an event for the other player
        return _.any(this.events, event => (
            event.name === 'onCardAbilityInitiated' && 
            (event.card.type === 'event' ? player.timerSettings.events : player.timerSettings.abilities) && 
            (event.context.player !== player)
        ));
    }

    promptWithCancelPrompt(player) {
        this.game.promptWithMenu(player, this, {
            source: 'Triggered Abilities',
            waitingPromptTitle: 'Waiting for opponent',
            activePrompt: {
                promptTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events),
                controls: this.getAdditionalPromptControls(),
                buttons: [
                    { timer: true, method: 'pass' },
                    { text: 'I need more time', timerCancel: true },
                    { text: 'Don\'t ask again until end of round', timerCancel: true, method: 'pass', arg: 'pauseRound' },
                    { text: 'Pass', method: 'pass' }
                ]
            }
        });
    }

    pass(player, arg) {
        if(arg === 'pauseRound') {
            player.noTimer = true;
            player.resetTimerAtEndOfRound = true;
        }
        if(this.prevPlayerPassed || !this.currentPlayer.opponent) {
            this.complete = true;
        } else {
            this.currentPlayer = this.currentPlayer.opponent;
            this.prevPlayerPassed = true;
        }

        return true;
    }

    filterChoices() {
        // If both players have passed, close the window
        if(this.complete) {
            return true;
        }
        // remove any choices which involve the current player canceling their own abilities
        if(this.abilityType === 'cancelinterrupt' && !this.currentPlayer.optionSettings.cancelOwnAbilities) {
            this.choices = this.choices.filter(context => !(
                context.player === this.currentPlayer &&
                context.event.name === 'onCardAbilityInitiated' &&
                context.event.context.player === this.currentPlayer
            ));
        }

        // if the current player has no available choices in this window, check to see if they should get a fake cancel prompt
        if(!_.any(this.choices, context => context.player === this.currentPlayer)) {
            if(this.showCancelPrompt(this.currentPlayer)) {
                this.promptWithCancelPrompt(this.currentPlayer);
                return false;
            }
            // Otherwise pass
            this.pass();
            return this.filterChoices();
        }

        // Filter choices for current player, and prompt
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
